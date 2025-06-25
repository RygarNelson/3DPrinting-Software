'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op, literal } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import VenditaRepository from '../repositories/vendita.repository.js';
import validationSchema from '../schemas/vendita.schema.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const projection = ['id', 'data_vendita', 'data_scadenza', 'cliente_id', 'totale_vendita', 'stato_spedizione', 'link_tracciamento'];
        // Pass an include option to also get all dettagli
        const include = [
            {
                association: 'dettagli',
                attributes: ['id', 'modello_id', 'quantita', 'prezzo', 'vendita_id', 'stampante_id', 'stato_stampa'], // projection for dettagli
                where: { deletedAt: null },
                required: false, // so that vendite with no non-deleted dettagli are still included
            }
        ];
        const vendita = await VenditaRepository.findOne(req.params.id, projection, include);
        res.status(200).json({
            success: true,
            data: vendita
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

            let includeCliente = { association: 'cliente', required: false, attributes: ['etichetta'], where: { deletedAt: null } };
            
            let includeDettagliModello = { association: 'modello', attributes: ['nome', 'descrizione'], required: false, where: { deletedAt: null } };
            let includeDettagliStampante = { association: 'stampante', attributes: ['nome'], required: false, where: { deletedAt: null } };
            let includeDettagli = {
                association: 'dettagli',
                where: { deletedAt: null },
                required: false,
                attributes: ['id', 'quantita', 'prezzo', 'stato_stampa', 'modello_id', 'stampante_id'],
                include: [includeDettagliModello, includeDettagliStampante]
            };

            if (req.body.stato_spedizione != null) {
                whereOptions.stato_spedizione = req.body.stato_spedizione;
            }
            if (req.body.cliente_id != null) {
                whereOptions.cliente_id = req.body.cliente_id;
            }

            if (req.body.search && req.body.search.trim() !== '') {
                // Handle search - we'll do separate queries for each search type and combine results
                let venditeIds = new Set();

                const search = req.body.search.trim();

                // Search 1: By cliente.etichetta
                const venditeByCliente = await VenditaRepository.find(
                    { ...whereOptions },
                    null, // no limit
                    null, // no offset
                    null, // no order
                    ['id'], // only get IDs
                    [{
                        association: 'cliente',
                        required: true,
                        attributes: [],
                        where: { 
                            etichetta: { [Op.like]: `%${search}%` },
                            deletedAt: null 
                        }
                    }]
                );
                venditeByCliente.forEach(v => venditeIds.add(v.id));

                // Search 2: By dettagli.modello
                const venditeByModello = await VenditaRepository.find(
                    { ...whereOptions },
                    null,
                    null,
                    null,
                    ['id'],
                    [{
                        association: 'dettagli',
                        required: true,
                        attributes: [],
                        where: { deletedAt: null },
                        include: [{
                            association: 'modello',
                            required: true,
                            attributes: [],
                            where: {
                                [Op.or]: [
                                    { nome: { [Op.like]: `%${search}%` } },
                                    { descrizione: { [Op.like]: `%${search}%` } }
                                ],
                                deletedAt: null
                            }
                        }]
                    }]
                );
                venditeByModello.forEach(v => venditeIds.add(v.id));

                // Search 3: By dettagli.stampante
                const venditeByStampante = await VenditaRepository.find(
                    { ...whereOptions },
                    null,
                    null,
                    null,
                    ['id'],
                    [{
                        association: 'dettagli',
                        required: true,
                        attributes: [],
                        where: { deletedAt: null },
                        include: [{
                            association: 'stampante',
                            required: true,
                            attributes: [],
                            where: { 
                                nome: { [Op.like]: `%${search}%` },
                                deletedAt: null 
                            }
                        }]
                    }]
                );
                venditeByStampante.forEach(v => venditeIds.add(v.id));

                whereOptions.id = { [Op.in]: Array.from(venditeIds) };
            }

            const limit = req.body.limit ? parseInt(req.body.limit) : 10;
            const offset = req.body.offset ? parseInt(req.body.offset) : 0;

            // --- Custom RANK for stato_spedizione ---
            const projection = [
                'id',
                'data_vendita',
                'data_scadenza',
                'totale_vendita',
                'stato_spedizione',
                [literal(`
                    CASE
                        WHEN stato_spedizione = 4 THEN 1
                        WHEN stato_spedizione = 0 THEN 2
                        WHEN stato_spedizione = 1 THEN 3
                        WHEN stato_spedizione = 2 THEN 4
                        WHEN stato_spedizione = 3 THEN 5
                        ELSE 6
                    END
                `), 'rank']
            ];
            const include = [includeCliente, includeDettagli];

            // Default order: by rank, then by id
            let order = [[literal('rank'), 'ASC'], ['id', 'ASC']];
            if (
                req.body.order && 
                req.body.order.column && 
                req.body.order.column.trim() !== '' && 
                req.body.order.direction && 
                req.body.order.direction.trim() !== '') {
                // Always order by rank first, then by the requested column
                order = [
                    [literal('rank'), 'ASC'],
                    [req.body.order.column, req.body.order.direction]
                ];
            }

            const vendite = await VenditaRepository.find(whereOptions, limit, offset, order, projection, include);

            res.status(200).json({
                success: true,
                data: vendite.rows,
                count: vendite.count
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
            const data = await VenditaRepository.updateOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Vendita modificata con successo!',
                technical_data: data
            });
        } else {
            const data = await VenditaRepository.insertOne(req, res);
            return res.status(200).json({
                success: true,
                data: 'Vendita creata con successo!',
                technical_data: data
            });
        }
    })
);

router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
        const data = await VenditaRepository.deleteOne(req.params.id);
        return res.status(200).json({
            success: true,
            data: 'Vendita eliminata con successo!',
            technical_data: data
        });
    })
);

router.post(
    '/vendita/stato/modifica',
    asyncHandler(async (req, res) => {
        if (req.body.id > 0 && req.body.stato_avanzamento > 0) {
            const data = await VenditaRepository.modificaStatoVendita(req.body.id, req.body.stato_avanzamento);
            return res.status(200).json({
                success: true,
                data: 'Stato spedizione modificato con successo!',
                technical_data: data
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Specificare l\'id della vendita e lo stato spedizione',
                technical_data: 'Nessun parametro di ricerca specificato'
            });
        }
    })
);

router.post(
    '/dettaglio/stato/modifica',
    asyncHandler(async (req, res) => {
        if (req.body.id > 0 && req.body.stato_avanzamento > 0) {
            const data = await VenditaRepository.modificaStatoDettaglio(req.body.id, req.body.stato_avanzamento);
            return res.status(200).json({
                success: true,
                data: 'Stato stampa modificato con successo!',
                technical_data: data
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Specificare l\'id del dettaglio e lo stato di avanzamento',
                technical_data: 'Nessun parametro di ricerca specificato'
            });
        }
    })
);

export default router;