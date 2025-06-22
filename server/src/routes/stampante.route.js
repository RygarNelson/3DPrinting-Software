'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import StampanteRepository from '../repositories/stampante.repository.js';
import validationSchema from '../schemas/stampante.schema.js';

const router = express.Router();

router.use(authenticate);

router.get(
    '/:id',
    async (req, res) => {
        const projection = ['id', 'nome', 'descrizione'];
        const stampante = await StampanteRepository.findOne(req.params.id, projection);
        res.status(200).json({
            success: true,
            data: stampante
        });
    }
);

router.post(
    '/listing',
    async (req, res) => {
        if (req != null && req.body != null) {
            let whereOptions = {};
            
            if (req.body.nome && req.body.nome.trim() !== '') {
                whereOptions.nome = {
                    [Op.like]: `%${req.body.nome}%`
                };
            }
            
            if (req.body.descrizione && req.body.descrizione.trim() !== '') {
                whereOptions.descrizione = {
                    [Op.like]: `%${req.body.descrizione}%`
                };
            }
            
            if (req.body.search && req.body.search.trim() !== '') {
                whereOptions = {
                    [Op.or]: [
                        {
                            nome: {
                                [Op.like]: `%${req.body.search}%`
                            }
                        },
                        {
                            descrizione: {
                                [Op.like]: `%${req.body.search}%`
                            }
                        }
                    ]
                };
            }

            // Ensure we only get non-deleted records
            whereOptions.deletedAt = null;

            const limit = req.body.limit ? parseInt(req.body.limit) : 10;
            const offset = req.body.offset ? parseInt(req.body.offset) : 0;

            let order = [['id', 'ASC']];
            if (
                req.body.order && 
                req.body.order.column && 
                req.body.order.column.trim() !== '' && 
                req.body.order.direction && 
                req.body.order.direction.trim() !== '') {
                order = [[req.body.order.column, req.body.order.direction]];
            }

            const projection = ['id', 'nome', 'descrizione'];

            const count = await StampanteRepository.count(whereOptions);

            StampanteRepository
            .find(whereOptions, limit, offset, order, projection)
            .then((stampanti) => {
                res.status(200).json({
                    success: true,
                    data: stampanti,
                    count: count
                });
            })
            .catch((error) => {
                return res.status(400).json({
                    success: false,
                    error: 'Errore nel trovare i clienti!',
                    technical_data: error
                });
            });
        }
        else {
            return res.status(400).json({
                success: false,
                error: 'Specificare i parametri di ricerca',
                technical_data: 'Nessun parametro di ricerca specificato'
            });
        }
    }
);

router.post(
    '/save',
    validationSchema.check(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Uno o più campi non sono validi',
                technical_data: errors.errors
            });
        } else {
            try {
                if (req.body.id && req.body.id > 0) {
                    // Update existing stampante
                    await StampanteRepository.updateOne(req, res);
                } else {
                    // Insert new stampante
                    await StampanteRepository.insertOne(req, res);
                }
            }
            catch (error) {
                console.log('Error in save route:', error);
                return res.status(400).json({
                    success: false,
                    error: 'Errore nel salvataggio della stampante',
                    technical_data: error
                });
            }
        }
    }
);

router.delete(
    '/:id',
    async (req, res) => {
        StampanteRepository
        .deleteOne(req.params.id)
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: 'Stampante eliminata con successo!',
                technical_data: data
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante l'eliminazione della stampante",
                technical_data: error.toString()
            });
        });
    }
);

export default router;