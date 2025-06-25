'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import StampanteRepository from '../repositories/stampante.repository.js';
import validationSchema from '../schemas/stampante.schema.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const projection = ['id', 'nome', 'descrizione'];
        const stampante = await StampanteRepository.findOne(req.params.id, projection);
        res.status(200).json({
            success: true,
            data: stampante
        });
    })
);

router.post(
    '/lookup',
    asyncHandler(async (req, res) => {
        let whereOptions = {
            deletedAt: null
        };

        const limit = undefined;
        const offset = undefined;
        const order = undefined;

        const projection = ['id', 'nome', 'descrizione'];

        const data = await StampanteRepository.find(whereOptions, limit, offset, order, projection);

        const result = data.rows.map((stampante) => {
            return {
                id: stampante.dataValues.id,
                etichetta: stampante.dataValues.nome,
                informazioniAggiuntive: stampante.dataValues.descrizione
            };
        });
        res.status(200).json({
            success: true,
            data: result
        });
    })
);

router.post(
    '/listing',
    asyncHandler(async (req, res) => {
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

            const stampanti = await StampanteRepository.find(whereOptions, limit, offset, order, projection);

            const result = await Promise.all(stampanti.rows.map(async (stampante) => {
                return {
                    id: stampante.dataValues.id,
                    nome: stampante.dataValues.nome,
                    descrizione: stampante.dataValues.descrizione,
                    isUsed: await StampanteRepository.isUsed(stampante.dataValues.id)
                }
            }));

            res.status(200).json({
                success: true,
                data: result,
                count: stampanti.count
            });
        }
        else {
            return res.status(400).json({
                success: false,
                error: 'Specificare i parametri di ricerca',
                technical_data: 'Nessun parametro di ricerca specificato'
            });
        }
    })
);

router.post(
    '/save',
    validationSchema.check(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Uno o più campi non sono validi',
                technical_data: errors.errors
            });
        }
        if (req.body.id && req.body.id > 0) {
            const data = await StampanteRepository.updateOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Stampante modificata con successo!',
                technical_data: data
            });
        } else {
            const data = await StampanteRepository.insertOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Stampante creata con successo!',
                technical_data: data
            });
        }
    })
);

router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const data = await StampanteRepository.deleteOne(req.params.id);
        return res.status(200).json({
            success: true,
            data: 'Stampante eliminata con successo!',
            technical_data: data
        });
    })
);

export default router;