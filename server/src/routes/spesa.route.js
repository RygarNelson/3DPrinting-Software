'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import { clearLoggingContext, setLoggingContext } from '../middleware/loggingContext.js';
import SpesaRepository from '../repositories/spesa.repository.js';
import validationSchema from '../schemas/spesa.schema.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);
router.use(setLoggingContext);
router.use(clearLoggingContext);

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const projection = ['id', 'data_spesa', 'totale_spesa', 'descrizione', 'quantita', 'tipo_spesa', 'unita_misura'];
        const spesa = await SpesaRepository.findOne(req.params.id, projection);
        res.status(200).json({
            success: true,
            data: spesa
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

            if (req.body.tipo_spesa != null) {
                whereOptions.tipo_spesa = req.body.tipo_spesa;
            }

            if (req.body.unita_misura != null) {
                whereOptions.unita_misura = req.body.unita_misura;
            }
            
            // Data spesa
            if (req.body.data_spesa && req.body.data_spesa.value && req.body.data_spesa.operator) {
                switch (req.body.data_spesa.operator) {
                    case 'dateIs': {
                        whereOptions.data_spesa = { [Op.eq]: req.body.data_spesa.value };
                        break;
                    }
                    case 'dateIsNot': {
                        whereOptions.data_spesa = { [Op.ne]: req.body.data_spesa.value };
                        break;
                    }
                    case 'dateBefore': {
                        whereOptions.data_spesa = { [Op.lte]: req.body.data_spesa.value };
                        break;
                    }
                    case 'dateAfter': {
                        whereOptions.data_spesa = { [Op.gte]: req.body.data_spesa.value };
                        break;
                    }
                }
            }

            // Totale Spesa
            if (req.body.totale_spesa && req.body.totale_spesa.value && req.body.totale_spesa.operator) {
                switch (req.body.totale_spesa.operator) {
                    case 'equals': {
                        whereOptions.totale_spesa = { [Op.eq]: req.body.totale_spesa.value };
                        break;
                    }
                    case 'notEquals': {
                        whereOptions.totale_spesa = { [Op.ne]: req.body.totale_spesa.value };
                        break;
                    }
                    case 'lt': {
                        whereOptions.totale_spesa = { [Op.lt]: req.body.totale_spesa.value };
                        break;
                    }
                    case 'lte': {
                        whereOptions.totale_spesa = { [Op.lte]: req.body.totale_spesa.value };
                        break;
                    }
                    case 'gt': {
                        whereOptions.totale_spesa = { [Op.gt]: req.body.totale_spesa.value };
                        break;
                    }
                    case 'gte': {
                        whereOptions.totale_spesa = { [Op.gte]: req.body.totale_spesa.value };
                        break;
                    }
                }
            }

            // Quantità
            if (req.body.quantita && req.body.quantita.value && req.body.quantita.operator) {
                switch (req.body.quantita.operator) {
                    case 'equals': {
                        whereOptions.quantita = { [Op.eq]: req.body.quantita.value };
                        break;
                    }
                    case 'notEquals': {
                        whereOptions.quantita = { [Op.ne]: req.body.quantita.value };
                        break;
                    }
                    case 'lt': {
                        whereOptions.quantita = { [Op.lt]: req.body.quantita.value };
                        break;
                    }
                    case 'lte': {
                        whereOptions.quantita = { [Op.lte]: req.body.quantita.value };
                        break;
                    }
                    case 'gt': {
                        whereOptions.quantita = { [Op.gt]: req.body.quantita.value };
                        break;
                    }
                    case 'gte': {
                        whereOptions.quantita = { [Op.gte]: req.body.quantita.value };
                        break;
                    }
                }
            }
            
            if (req.body.search && req.body.search.trim() !== '') {
                whereOptions = {
                    [Op.or]: [
                        {
                            descrizione: {
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

            const projection = ['id', 'data_spesa', 'totale_spesa', 'descrizione', 'quantita', 'tipo_spesa', 'unita_misura'];

            const spese = await SpesaRepository.find(whereOptions, limit, offset, order, projection);

            const result = await Promise.all(spese.rows.map(async (spesa) => {
                return {
                    id: spesa.dataValues.id,
                    data_spesa: spesa.dataValues.data_spesa,
                    totale_spesa: spesa.dataValues.totale_spesa,
                    descrizione: spesa.dataValues.descrizione,
                    quantita: spesa.dataValues.quantita,
                    tipo_spesa: spesa.dataValues.tipo_spesa,
                    unita_misura: spesa.dataValues.unita_misura,
                }
            }));

            res.status(200).json({
                success: true,
                data: result,
                count: spese.count
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
            const data = await SpesaRepository.updateOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Stampante modificata con successo!',
                technical_data: data
            });
        } else {
            const data = await SpesaRepository.insertOne(req, res);
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
        const data = await SpesaRepository.deleteOne(req.params.id);
        return res.status(200).json({
            success: true,
            data: 'Stampante eliminata con successo!',
            technical_data: data
        });
    })
);

export default router;