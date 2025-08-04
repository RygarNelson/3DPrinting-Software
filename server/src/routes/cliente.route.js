'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import { clearLoggingContext, setLoggingContext } from '../middleware/loggingContext.js';
import ClienteRepository from '../repositories/cliente.repository.js';
import validationSchema from '../schemas/cliente.schema.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);
router.use(setLoggingContext);
router.use(clearLoggingContext);

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const projection = ['id', 'nome', 'cognome', 'ragione_sociale', 'email', 'telefono'];
        const cliente = await ClienteRepository.findOne(req.params.id, projection);
        res.status(200).json({
            success: true,
            data: cliente
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

        const projection = ['id', 'etichetta', 'email', 'telefono'];

        const data = await ClienteRepository.find(whereOptions, limit, offset, order, projection);

        const result = data.rows.map((cliente) => {
            return {
                id: cliente.dataValues.id,
                etichetta: cliente.dataValues.etichetta,
                informazioniAggiuntive: `${cliente.dataValues.email ? cliente.dataValues.email : 'No email'} - ${cliente.dataValues.telefono ? cliente.dataValues.telefono : 'No telefono'}`
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

            if (req.body.etichetta && req.body.etichetta.trim() !== '') {
                whereOptions.etichetta = {
                    [Op.like]: `%${req.body.etichetta}%`
                };
            }
            if (req.body.email && req.body.email.trim() !== '') {
                whereOptions.email = {
                    [Op.like]: `%${req.body.email}%`
                };
            }
            if (req.body.telefono && req.body.telefono.trim() !== '') {
                whereOptions.telefono = {
                    [Op.like]: `%${req.body.telefono}%`
                };
            }

            if (req.body.search && req.body.search.trim() !== '') {
                whereOptions = {
                    [Op.or]: [
                        { etichetta: { [Op.like]: `%${req.body.search}%` } },
                        { email: { [Op.like]: `%${req.body.search}%` } },
                        { telefono: { [Op.like]: `%${req.body.search}%` } }
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
                req.body.order.direction.trim() !== ''
            ) {
                order = [[req.body.order.column, req.body.order.direction]];
            }

            const projection = ['id', 'etichetta', 'email', 'telefono'];

            const clienti = await ClienteRepository.find(whereOptions, limit, offset, order, projection);
            
            const result = await Promise.all(clienti.rows.map(async (cliente) => {
                return {
                    id: cliente.dataValues.id,
                    etichetta: cliente.dataValues.etichetta,
                    email: cliente.dataValues.email,
                    telefono: cliente.dataValues.telefono,
                    isUsed: await ClienteRepository.isUsed(cliente.dataValues.id)
                }
            }));

            res.status(200).json({
                success: true,
                data: result,
                count: clienti.count
            });
        } else {
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
            const data = await ClienteRepository.updateOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Cliente modificato con successo!',
                technical_data: data
            });
        } else {
            const data = await ClienteRepository.insertOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Cliente creato con successo!',
                technical_data: data
            });
        }
    })
);

router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const data = await ClienteRepository.deleteOne(req.params.id);
        return res.status(200).json({
            success: true,
            data: 'Cliente eliminato con successo!',
            technical_data: data
        });
    })
);

router.get(
    '/vinted/id',
    asyncHandler(async (req, res) => {
        const vintedId = await ClienteRepository.getClienteVintedId();
        res.status(200).json({
            success: true,
            data: vintedId
        });
    })
);

export default router; 