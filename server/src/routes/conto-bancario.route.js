'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import { clearLoggingContext, setLoggingContext } from '../middleware/loggingContext.js';
import ContoBancarioRepository from '../repositories/conto-bancario.repository.js';
import validationSchema from '../schemas/conto-bancario.schema.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);
router.use(setLoggingContext);
router.use(clearLoggingContext);

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const projection = ['id', 'nome_proprietario', 'cognome_proprietario', 'iban'];
        const contoBancario = await ContoBancarioRepository.findOne(req.params.id, projection);
        res.status(200).json({
            success: true,
            data: contoBancario
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
        const order = [['id', 'ASC']];

        const projection = ['id', 'nome_proprietario', 'cognome_proprietario', 'iban'];

        const data = await ContoBancarioRepository.find(whereOptions, limit, offset, order, projection);

        const result = data.rows.map((contoBancario) => {
            let nomeCompleto = '';
            if (contoBancario.dataValues.nome_proprietario && contoBancario.dataValues.nome_proprietario.trim() !== '') {
                nomeCompleto += contoBancario.dataValues.nome_proprietario;
            }
            if (contoBancario.dataValues.cognome_proprietario && contoBancario.dataValues.cognome_proprietario.trim() !== '') {
                nomeCompleto += ' ' + contoBancario.dataValues.cognome_proprietario;
            }

            return {
                id: contoBancario.dataValues.id,
                etichetta: contoBancario.dataValues.iban,
                informazioniAggiuntive: nomeCompleto
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
            let whereOptions = {
                deletedAt: null
            };
            
            if (req.body.nome_proprietario && req.body.nome_proprietario.trim() !== '') {
                whereOptions.nome_proprietario = {
                    [Op.like]: `%${req.body.nome_proprietario}%`
                };
            }
            
            if (req.body.cognome_proprietario && req.body.cognome_proprietario.trim() !== '') {
                whereOptions.cognome_proprietario = {
                    [Op.like]: `%${req.body.cognome_proprietario}%`
                };
            }

            if (req.body.iban && req.body.iban.trim() !== '') {
                whereOptions.iban = {
                    [Op.like]: `%${req.body.iban}%`
                };
            }
            
            if (req.body.search && req.body.search.trim() !== '') {
                whereOptions = {
                    [Op.or]: [
                        {
                            nome_proprietario: {
                                [Op.like]: `%${req.body.search}%`
                            }
                        },
                        {
                            cognome_proprietario: {
                                [Op.like]: `%${req.body.search}%`
                            }
                        },
                        {
                            iban: {
                                [Op.like]: `%${req.body.search}%`
                            }
                        }
                    ]
                };
            }

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

            const projection = ['id', 'nome_proprietario', 'cognome_proprietario', 'iban'];

            const contiBancari = await ContoBancarioRepository.find(whereOptions, limit, offset, order, projection);

            const result = await Promise.all(contiBancari.rows.map(async (contoBancario) => {
                return {
                    id: contoBancario.dataValues.id,
                    nome_proprietario: contoBancario.dataValues.nome_proprietario,
                    cognome_proprietario: contoBancario.dataValues.cognome_proprietario,
                    iban: contoBancario.dataValues.iban,
                    isUsed: await ContoBancarioRepository.isUsed(contoBancario.dataValues.id)
                }
            }));

            res.status(200).json({
                success: true,
                data: result,
                count: contiBancari.count
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
            const data = await ContoBancarioRepository.updateOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Conto bancario modificato con successo!',
                technical_data: data
            });
        } else {
            const data = await ContoBancarioRepository.insertOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Conto bancario creato con successo!',
                technical_data: data
            });
        }
    })
);

router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const data = await ContoBancarioRepository.deleteOne(req.params.id);
        return res.status(200).json({
            success: true,
            data: 'Conto bancario eliminato con successo!',
            technical_data: data
        });
    })
);

export default router;