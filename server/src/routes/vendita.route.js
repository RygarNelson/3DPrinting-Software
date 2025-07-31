'use strict'

import express from 'express';
import { validationResult } from 'express-validator';
import { Op, literal } from 'sequelize';
import { authenticate } from '../middleware/authenticate.js';
import ContoBancarioRepository from '../repositories/conto-bancario.repository.js';
import VenditaRepository from '../repositories/vendita.repository.js';
import validationSchema from '../schemas/vendita.schema.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get(
    '/vendita/:id',
    asyncHandler(async (req, res) => {
        const projection = [
            'id', 
            'data_vendita', 
            'data_scadenza', 
            'data_scadenza_spedizione', 
            'cliente_id', 
            'totale_vendita', 
            'stato_spedizione', 
            'link_tracciamento', 
            'conto_bancario_id'
        ];
        // Pass an include option to also get all dettagli and basette
        const include = [
            {
                association: 'dettagli',
                attributes: [
                    'id', 
                    'modello_id', 
                    'quantita', 
                    'prezzo', 
                    'vendita_id', 
                    'stampante_id', 
                    'stato_stampa', 
                    'descrizione', 
                    'stampa_is_pezzo_singolo', 
                    'stampa_is_parziale'
                ], // projection for dettagli
                where: { deletedAt: null },
                required: false, // so that vendite with no non-deleted dettagli are still included
            },
            {
                association: 'basette',
                attributes: [
                    'id',
                    'vendita_id',
                    'dimensione', 
                    'quantita', 
                    'stato_stampa'
                ], // projection for basette
                where: { deletedAt: null },
                required: false, // so that vendite with no non-deleted basette are still included
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
                attributes: [
                    'id',
                    'quantita', 
                    'prezzo', 
                    'stato_stampa', 
                    'modello_id', 
                    'stampante_id', 
                    'descrizione', 
                    'stampa_is_pezzo_singolo', 
                    'stampa_is_parziale'
                ],
                include: [includeDettagliModello, includeDettagliStampante]
            };
            let includeContoBancario = { association: 'conto_bancario', required: false, attributes: ['iban'], where: { deletedAt: null } };
            let includeBasette = {
                association: 'basette',
                where: { deletedAt: null },
                required: false,
                attributes: [
                    'id',
                    'dimensione', 
                    'quantita', 
                    'stato_stampa'
                ]
            };

            if (req.body.stato_spedizione != null) {
                whereOptions.stato_spedizione = req.body.stato_spedizione;
            }
            if (req.body.cliente_id != null) {
                whereOptions.cliente_id = req.body.cliente_id;
            }
            if (req.body.conto_bancario_id != null) {
                whereOptions.conto_bancario_id = req.body.conto_bancario_id;
            }

            if ((req.body.search && req.body.search.trim() !== '') || (req.body.stato_stampa != null)) {
                // Handle search - we'll do separate queries for each search type and combine results
                let venditeIds = new Set();

                if (req.body.search && req.body.search.trim() !== '') {
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
                    venditeByCliente.rows.forEach(v => venditeIds.add(v.id));

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
                    venditeByModello.rows.forEach(v => venditeIds.add(v.id));

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
                    venditeByStampante.rows.forEach(v => venditeIds.add(v.id));

                    // Search 4: By conto_bancario
                    const venditeByContoBancario = await VenditaRepository.find(
                        { ...whereOptions },
                        null,
                        null,
                        null,
                        ['id'],
                        [{
                            association: 'conto_bancario',
                            required: true,
                            attributes: [],
                            where: { 
                                iban: { [Op.like]: `%${search}%` },
                                deletedAt: null
                            }
                        }]
                    );
                    venditeByContoBancario.rows.forEach(v => venditeIds.add(v.id));

                    // Search 5: By dettagli.descrizione
                    const venditeByDescrizione = await VenditaRepository.find(
                        { ...whereOptions },
                        null,
                        null,
                        null,
                        ['id'],
                        [{
                            association: 'dettagli',
                            required: true,
                            attributes: [],
                            where: { deletedAt: null, descrizione: { [Op.like]: `%${search}%` } },
                        }]
                    );
                    venditeByDescrizione.rows.forEach(v => venditeIds.add(v.id));

                    // Search 6: By basette.dimensione
                    const venditeByBasetta = await VenditaRepository.find(
                        { ...whereOptions },
                        null,
                        null,
                        null,
                        ['id'],
                        [{
                            association: 'basette',
                            required: true,
                            attributes: [],
                            where: { 
                                deletedAt: null, 
                                dimensione: { [Op.like]: `%${search}%` } 
                            },
                        }]
                    );
                    venditeByBasetta.rows.forEach(v => venditeIds.add(v.id));
                }

                // Stato stampa
                if (req.body.stato_stampa != null) {
                    const venditeByDettaglioConStatoStampa = await VenditaRepository.find(
                        { ...whereOptions },
                        null, // no limit
                        null, // no offset
                        null, // no order
                        ['id'], // only get IDs
                        [{
                            association: 'dettagli',
                            required: true,
                            attributes: [],
                            where: { deletedAt: null, stato_stampa: req.body.stato_stampa },
                        }]
                    );
                    venditeByDettaglioConStatoStampa.rows.forEach(v => venditeIds.add(v.id));
                }

                // Stato stampa basette
                if (req.body.basetta_stato_stampa != null) {
                    const venditeByBasettaConStatoStampa = await VenditaRepository.find(
                        { ...whereOptions },
                        null, // no limit
                        null, // no offset
                        null, // no order
                        ['id'], // only get IDs
                        [{
                            association: 'basette',
                            required: true,
                            attributes: [],
                            where: { deletedAt: null, stato_stampa: req.body.basetta_stato_stampa },
                        }]
                    );
                    venditeByBasettaConStatoStampa.rows.forEach(v => venditeIds.add(v.id));
                }

                whereOptions.id = { [Op.in]: Array.from(venditeIds) };
            }

            // Data vendita
            if (req.body.data_vendita && req.body.data_vendita.value && req.body.data_vendita.operator) {
                switch (req.body.data_vendita.operator) {
                    case 'dateIs': {
                        whereOptions.data_vendita = { [Op.eq]: req.body.data_vendita.value };
                        break;
                    }
                    case 'dateIsNot': {
                        whereOptions.data_vendita = { [Op.ne]: req.body.data_vendita.value };
                        break;
                    }
                    case 'dateBefore': {
                        whereOptions.data_vendita = { [Op.lte]: req.body.data_vendita.value };
                        break;
                    }
                    case 'dateAfter': {
                        whereOptions.data_vendita = { [Op.gte]: req.body.data_vendita.value };
                        break;
                    }
                }
            }

            // Data scadenza
            if (req.body.data_scadenza && req.body.data_scadenza.value && req.body.data_scadenza.operator) {
                switch (req.body.data_scadenza.operator) {
                    case 'dateIs': {
                        whereOptions.data_scadenza = { [Op.eq]: req.body.data_scadenza.value };
                        break;
                    }
                    case 'dateIsNot': {
                        whereOptions.data_scadenza = { [Op.ne]: req.body.data_scadenza.value };
                        break;
                    }
                    case 'dateBefore': {
                        whereOptions.data_scadenza = { [Op.lte]: req.body.data_scadenza.value };
                        break;
                    }
                    case 'dateAfter': {
                        whereOptions.data_scadenza = { [Op.gte]: req.body.data_scadenza.value };
                        break;
                    }
                }
            }

            // Data scadenza spedizione
            if (req.body.data_scadenza_spedizione && req.body.data_scadenza_spedizione.value && req.body.data_scadenza_spedizione.operator) {
                switch (req.body.data_scadenza_spedizione.operator) {
                    case 'dateIs': {
                        whereOptions.data_scadenza_spedizione = { [Op.eq]: req.body.data_scadenza_spedizione.value };
                        break;
                    }
                    case 'dateIsNot': {
                        whereOptions.data_scadenza_spedizione = { [Op.ne]: req.body.data_scadenza_spedizione.value };
                        break;
                    }
                    case 'dateBefore': {
                        whereOptions.data_scadenza_spedizione = { [Op.lte]: req.body.data_scadenza_spedizione.value };
                        break;
                    }
                    case 'dateAfter': {
                        whereOptions.data_scadenza_spedizione = { [Op.gte]: req.body.data_scadenza_spedizione.value };
                        break;
                    }
                }
            }

            // Totale Vendita
            if (req.body.totale_vendita && req.body.totale_vendita.value && req.body.totale_vendita.operator) {
                switch (req.body.totale_vendita.operator) {
                    case 'equals': {
                        whereOptions.totale_vendita = { [Op.eq]: req.body.totale_vendita.value };
                        break;
                    }
                    case 'notEquals': {
                        whereOptions.totale_vendita = { [Op.ne]: req.body.totale_vendita.value };
                        break;
                    }
                    case 'lt': {
                        whereOptions.totale_vendita = { [Op.lt]: req.body.totale_vendita.value };
                        break;
                    }
                    case 'lte': {
                        whereOptions.totale_vendita = { [Op.lte]: req.body.totale_vendita.value };
                        break;
                    }
                    case 'gt': {
                        whereOptions.totale_vendita = { [Op.gt]: req.body.totale_vendita.value };
                        break;
                    }
                    case 'gte': {
                        whereOptions.totale_vendita = { [Op.gte]: req.body.totale_vendita.value };
                        break;
                    }
                }
            }

            if (req.body.isInScadenza || req.body.isScaduto) {
                let dataOggi = new Date();

                if (req.body.isInScadenza) {
                    whereOptions.data_scadenza = { [Op.lte]: dataOggi };
                    whereOptions.data_scadenza_spedizione = { [Op.gt]: dataOggi };
                } else {
                    whereOptions.data_scadenza_spedizione = { [Op.lte]: dataOggi };
                }

                whereOptions.stato_spedizione = { [Op.in]: [0, 4] };
            }

            const limit = req.body.limit ? parseInt(req.body.limit) : 10;
            const offset = req.body.offset ? parseInt(req.body.offset) : 0;

            // --- Custom RANK for stato_spedizione ---
            const projection = [
                'id',
                'data_vendita',
                'data_scadenza',
                'data_scadenza_spedizione',
                'totale_vendita',
                'stato_spedizione',
                [literal(`
                    CASE
                        WHEN stato_spedizione IN (0, 4)
                            AND CURRENT_DATE >= data_scadenza
                            AND CURRENT_DATE < data_scadenza_spedizione
                        THEN 1 ELSE 0 END
                `), 'isInScadenza'],
                [literal(`
                    CASE
                        WHEN stato_spedizione IN (0, 4)
                            AND CURRENT_DATE >= data_scadenza_spedizione
                        THEN 1 ELSE 0 END
                `), 'isScaduto'],
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
            const include = [includeCliente, includeDettagli, includeContoBancario, includeBasette];

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
            const andamentoUltimiTreMesi = await VenditaRepository.ottieniAndamentoUltimiTreMesi();
            const andamentoUltimiTreMesiSospese = await VenditaRepository.ottieniAndamentoUltimiTreMesiSospese();

            res.status(200).json({
                success: true,
                data: vendite.rows,
                count: vendite.count,
                ultimiTreMesi: andamentoUltimiTreMesi,
                ultimiTreMesiSospese: andamentoUltimiTreMesiSospese
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
        if (req.body.id > 0 && req.body.stato_avanzamento != null) {
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
        if (req.body.id > 0 && req.body.stato_avanzamento != null) {
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

router.post(
    '/basetta/stato/modifica',
    asyncHandler(async (req, res) => {
        if (req.body.id > 0 && req.body.stato_avanzamento != null) {
            const data = await VenditaRepository.modificaStatoBasetta(req.body.id, req.body.stato_avanzamento);
            return res.status(200).json({
                success: true,
                data: 'Stato stampa basetta modificato con successo!',
                technical_data: data
            });
        } else {
            return res.status(400).json({
                success: false,
                error: 'Specificare l\'id della basetta e lo stato di avanzamento',
                technical_data: 'Nessun parametro di ricerca specificato'
            });
        }
    })
);

router.get(
    '/anni',
    asyncHandler(async (req, res) => {
        const data = await VenditaRepository.ottieniTuttiAnni();
        return res.status(200).json({
            success: true,
            data: data
        });
    })
);

router.get(
    '/andamento/:anno',
    asyncHandler(async (req, res) => {
        const data = await VenditaRepository.ottieniAndamentoVendite(req.params.anno);
        const totaleVendite = data.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
        const totaleSpese = data.data.datasets[1].data.reduce((acc, curr) => acc + curr, 0);
        const totaleSospese = data.data.datasets[2].data.reduce((acc, curr) => acc + curr, 0);

        // Per ogni elemento del dataset delle vendite in sospeso, sommare il totale delle vendite
        data.data.datasets[2].data = data.data.datasets[2].data.map((item, index) => {
            return item + data.data.datasets[0].data[index];
        });

        return res.status(200).json({
            success: true,
            data: data,
            totaleVendite: totaleVendite,
            totaleSpese: totaleSpese,
            totaleSospese: totaleSospese
        });
    })
);

router.get(
    '/conti-bancari/:anno',
    asyncHandler(async (req, res) => {
        let result = [];

        const contiBancari = await ContoBancarioRepository.getAll();
        for (const contoBancario of contiBancari) {
            const totaleVendite = await VenditaRepository.sommaVenditePerContoBancarioAnno(req.params.anno, contoBancario.id);
            result.push({
                id: contoBancario.id,
                iban: contoBancario.iban,
                totale_vendite: totaleVendite
            });
        }

        return res.status(200).json({
            success: true,
            data: result
        });
    })
);

router.get(
    '/riepilogo/modelli/:anno',
    asyncHandler(async (req, res) => {
        const riepilogo = await VenditaRepository.ottieniRiepilogoVenditeModelliPerMese(req.params.anno);
        
        return res.status(200).json({
            success: true,
            data: riepilogo
        });
    })
);

router.get(
    '/stato',
    asyncHandler(async (req, res) => {
        const data = await VenditaRepository.ottieniStatoVendite();
        return res.status(200).json({
            success: true,
            data: data
        });
    })
);

router.post(
    '/conto-bancario/modifica',
    asyncHandler(async (req, res) => {
        await VenditaRepository.modificaContoBancarioVendite(req.body.vendite_ids, req.body.conto_bancario_id);
        return res.status(200).json({
            success: true,
            data: 'Conto bancario aggiornato con successo!',
        });
    })
);

export default router;