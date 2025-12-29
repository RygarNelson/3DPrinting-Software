'use strict'

import { col, fn, Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import Basetta from '../models/basetta.model.js';
import Modello from '../models/modello.model.js';
import Spesa from '../models/spesa.model.js';
import Vendita from '../models/vendita.model.js';
import VenditaDettaglio from '../models/venditaDettaglio.model.js';
import loggingService from '../services/logging.service.js';
import BaseRepository from './base.repository.js';

class VenditaRepository extends BaseRepository {
    constructor() {
        super(Vendita, 'T_VENDITE');
    }

    getAll() {
        return Vendita.findAll({
            include: [
                { association: 'dettagli', where: { deletedAt: null }, required: false },
                { association: 'cliente', where: { deletedAt: null }, required: false },
                { association: 'basette', where: { deletedAt: null }, required: false }
            ]
        });
    }

    findOne(id, projection, include) {
        return Vendita.findOne({ where: { id }, attributes: projection, include: include });
    }

    find(whereOptions, limit, offset, order, projection, include) {
        return Vendita.findAndCountAll({
            where: whereOptions,
            attributes: projection,
            limit: limit,
            offset: offset,
            order: order,
            include: include,
            distinct: true
        });
    }

    async insertOne(req) {
        const transaction = await sequelize.transaction();
        try {
            const { data_vendita, data_scadenza, data_scadenza_spedizione, stato_spedizione, link_tracciamento, cliente_id, dettagli, basette, conto_bancario_id, etichetta_spedizione } = req.body;
            
            const data = {
                data_vendita,
                data_scadenza,
                data_scadenza_spedizione,
                stato_spedizione,
                link_tracciamento,
                cliente_id,
                conto_bancario_id,
                etichetta_spedizione
            };

            const additionalData = {
                request_source: 'HTTP',
                endpoint: req.originalUrl,
                method: req.method,
                operation_details: 'Complex insert with dettagli and basette'
            };

            const vendita = await Vendita.create(data, { transaction: transaction });

            // Log the main vendita creation
            await loggingService.logInsert('T_VENDITE', vendita.id, vendita.toJSON(), additionalData, transaction);

            let totale = 0;
            if (Array.isArray(dettagli)) {
                for (const dettaglio of dettagli) {
                    const dettaglioCreated = await VenditaDettaglio.create({
                        vendita_id: vendita.id,
                        modello_id: dettaglio.modello_id,
                        stampante_id: dettaglio.stampante_id,
                        stato_stampa: dettaglio.stato_stampa,
                        quantita: dettaglio.quantita,
                        prezzo: dettaglio.prezzo,
                        descrizione: dettaglio.descrizione,
                        stampa_is_pezzo_singolo: dettaglio.stampa_is_pezzo_singolo,
                        stampa_is_parziale: dettaglio.stampa_is_parziale,
                        basetta_dimensione: dettaglio.basetta_dimensione,
                        basetta_quantita: dettaglio.basetta_quantita
                    }, { transaction: transaction });

                    // Log dettaglio creation
                    await loggingService.logInsert('T_VENDITE_DETTAGLI', dettaglioCreated.id, dettaglioCreated.toJSON(), {
                            ...additionalData,
                            parent_vendita_id: vendita.id
                        }, transaction);

                    if (dettaglio.prezzo) {
                        totale += parseFloat(dettaglio.prezzo);
                    }
                }
            }

            // Create basette
            if (Array.isArray(basette)) {
                for (const basetta of basette) {
                    const basettaCreated = await Basetta.create({
                        vendita_id: vendita.id,
                        dimensione: basetta.dimensione,
                        quantita: basetta.quantita,
                        stato_stampa: basetta.stato_stampa
                    }, { transaction: transaction });

                    // Log basetta creation
                    await loggingService.logInsert('T_BASETTE', basettaCreated.id, basettaCreated.toJSON(), {
                            ...additionalData,
                            parent_vendita_id: vendita.id
                        }, transaction);
                }
            }

            await vendita.update({ totale_vendita: totale }, { transaction: transaction });

            // For each dettaglio, if the modello is not null and is vendibile on vinted, set is in vendita to false
            for (const dettaglio of dettagli) {
                const modello = await Modello.findByPk(dettaglio.modello_id);
                if (modello != null && modello.vinted_vendibile) {
                    await modello.update({ vinted_is_in_vendita: false }, { transaction: transaction });
                    
                    // Log modello update
                    await loggingService.logUpdate('T_MODELLI', modello.id, 'vinted_is_in_vendita', true, false, {
                        ...additionalData,
                        reason: 'Model set as not in sale after vendita creation'
                    }, transaction);
                }
            }

            await transaction.commit();
            return vendita;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateOne(req) {
        const transaction = await sequelize.transaction();
        try {
            const { id, data_vendita, data_scadenza, data_scadenza_spedizione, stato_spedizione, link_tracciamento, cliente_id, dettagli, basette, conto_bancario_id, etichetta_spedizione } = req.body;
            
            const vendita = await Vendita.findByPk(id, { 
                include: [
                    { model: VenditaDettaglio, as: 'dettagli' },
                    { model: Basetta, as: 'basette' }
                ], 
                transaction: transaction 
            });
            if (!vendita) throw new Error('Vendita non trovata');

            const oldData = vendita.toJSON();
            await vendita.update({ data_vendita, data_scadenza, data_scadenza_spedizione, stato_spedizione, link_tracciamento, cliente_id, conto_bancario_id, etichetta_spedizione }, { transaction: transaction });

            const additionalData = {
                request_source: 'HTTP',
                endpoint: req.originalUrl,
                method: req.method,
                operation_details: 'Complex update with dettagli and basette'
            };

            // Log the main vendita update
            await loggingService.logUpdate('T_VENDITE', vendita.id, oldData, vendita.toJSON(), additionalData, transaction);

            // Handle dettagli
            const existingDettagli = vendita.dettagli || [];
            const dettagliMap = new Map();
            if (Array.isArray(dettagli)) {
                for (const dettaglio of dettagli) {
                    if (dettaglio.id) {
                        dettagliMap.set(dettaglio.id, dettaglio);
                    }
                }
            }
            // Update or delete existing dettagli
            for (const existingDettaglio of existingDettagli) {
                if (dettagliMap.has(existingDettaglio.id)) {
                    const dettaglio = dettagliMap.get(existingDettaglio.id);
                    const oldDettaglioData = existingDettaglio.toJSON();
                    await existingDettaglio.update({ 
                        modello_id: dettaglio.modello_id, 
                        stampante_id: dettaglio.stampante_id, 
                        stato_stampa: dettaglio.stato_stampa, 
                        quantita: dettaglio.quantita, 
                        prezzo: dettaglio.prezzo, 
                        descrizione: dettaglio.descrizione,
                        stampa_is_pezzo_singolo: dettaglio.stampa_is_pezzo_singolo,
                        stampa_is_parziale: dettaglio.stampa_is_parziale,
                        basetta_dimensione: dettaglio.basetta_dimensione,
                        basetta_quantita: dettaglio.basetta_quantita
                    }, { transaction: transaction });
                    
                    // Log dettaglio update
                    await loggingService.logUpdate('T_VENDITE_DETTAGLI', existingDettaglio.id, oldDettaglioData, existingDettaglio.toJSON(), {
                        ...additionalData,
                        parent_vendita_id: vendita.id
                    }, transaction);
                    
                    dettagliMap.delete(existingDettaglio.id);
                } else {
                    const oldDettaglioData = existingDettaglio.toJSON();
                    await existingDettaglio.destroy({ transaction: transaction });
                    
                    // Log dettaglio deletion
                    await loggingService.logDelete('T_VENDITE_DETTAGLI', existingDettaglio.id, oldDettaglioData, {
                        ...additionalData,
                        parent_vendita_id: vendita.id
                    }, transaction);
                }
            }
            // Insert new dettagli
            let totale = 0;
            if (Array.isArray(dettagli)) {
                for (const dettaglio of dettagli) {
                    if (!dettaglio.id) {
                        const dettaglioCreated = await VenditaDettaglio.create({
                            vendita_id: vendita.id,
                            modello_id: dettaglio.modello_id,
                            stampante_id: dettaglio.stampante_id,
                            stato_stampa: dettaglio.stato_stampa,
                            quantita: dettaglio.quantita,
                            prezzo: dettaglio.prezzo,
                            descrizione: dettaglio.descrizione,
                            stampa_is_pezzo_singolo: dettaglio.stampa_is_pezzo_singolo,
                            stampa_is_parziale: dettaglio.stampa_is_parziale,
                            basetta_dimensione: dettaglio.basetta_dimensione,
                            basetta_quantita: dettaglio.basetta_quantita
                        }, { transaction: transaction });
                        
                        // Log new dettaglio creation
                        await loggingService.logInsert('T_VENDITE_DETTAGLI', dettaglioCreated.id, dettaglioCreated.toJSON(), {
                            ...additionalData,
                            parent_vendita_id: vendita.id
                        }, transaction);
                    }
                    if (dettaglio.prezzo) {
                        totale += parseFloat(dettaglio.prezzo);
                    }
                }
            }

            // Handle basette
            const existingBasette = vendita.basette || [];
            const basetteMap = new Map();
            if (Array.isArray(basette)) {
                for (const basetta of basette) {
                    if (basetta.id) {
                        basetteMap.set(basetta.id, basetta);
                    }
                }
            }
            // Update or delete existing basette
            for (const existingBasetta of existingBasette) {
                if (basetteMap.has(existingBasetta.id)) {
                    const basetta = basetteMap.get(existingBasetta.id);
                    const oldBasettaData = existingBasetta.toJSON();
                    await existingBasetta.update({ 
                        dimensione: basetta.dimensione, 
                        quantita: basetta.quantita, 
                        stato_stampa: basetta.stato_stampa
                    }, { transaction: transaction });
                    
                    // Log basetta update
                    await loggingService.logUpdate('T_BASETTE', existingBasetta.id, oldBasettaData, existingBasetta.toJSON(), {
                        ...additionalData,
                        parent_vendita_id: vendita.id
                    }, transaction);
                    
                    basetteMap.delete(existingBasetta.id);
                } else {
                    const oldBasettaData = existingBasetta.toJSON();
                    await existingBasetta.destroy({ transaction: transaction });
                    
                    // Log basetta deletion
                    await loggingService.logDelete('T_BASETTE', existingBasetta.id, oldBasettaData, {
                        ...additionalData,
                        parent_vendita_id: vendita.id
                    }, transaction);
                }
            }
            // Insert new basette
            if (Array.isArray(basette)) {
                for (const basetta of basette) {
                    if (!basetta.id) {
                        const basettaCreated = await Basetta.create({
                            vendita_id: vendita.id,
                            dimensione: basetta.dimensione,
                            quantita: basetta.quantita,
                            stato_stampa: basetta.stato_stampa
                        }, { transaction: transaction });
                        
                        // Log new basetta creation
                        await loggingService.logInsert('T_BASETTE', basettaCreated.id, basettaCreated.toJSON(), {
                            ...additionalData,
                            parent_vendita_id: vendita.id
                        }, transaction);
                    }
                }
            }

            await vendita.update({ totale_vendita: totale }, { transaction: transaction });

            // For each dettaglio, if the modello is not null and is vendibile on vinted, set is in vendita to false
            for (const dettaglio of dettagli) {
                if (dettaglio.modello_id) {
                    const modello = await Modello.findByPk(dettaglio.modello_id);
                    if (modello != null && modello.vinted_vendibile) {
                        const oldVintedStatus = modello.vinted_is_in_vendita;
                        await modello.update({ vinted_is_in_vendita: false }, { transaction: transaction });
                        
                        // Log modello update
                        await loggingService.logUpdate('T_MODELLI', modello.id, 'vinted_is_in_vendita', oldVintedStatus, false, {
                            ...additionalData,
                            reason: 'Model set as not in sale after vendita update'
                        }, transaction);
                    }
                }
            }

            await transaction.commit();
            return vendita;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteOne(id) {
        const transaction = await sequelize.transaction();
        try {
            const vendita = await Vendita.findByPk(id, {
                include: [
                    { model: VenditaDettaglio, as: 'dettagli' },
                    { model: Basetta, as: 'basette' }
                ],
                transaction: transaction
            });

            if (!vendita) {
                throw new Error('Vendita non trovata');
            }

            const additionalData = {
                request_source: 'HTTP',
                operation: 'DELETE',
                operation_details: 'Complex delete with dettagli and basette'
            };

            // Log dettagli deletions
            if (vendita.dettagli) {
                for (const dettaglio of vendita.dettagli) {
                    await loggingService.logDelete('T_VENDITE_DETTAGLI', dettaglio.id, dettaglio.toJSON(), {
                        ...additionalData,
                        parent_vendita_id: vendita.id
                    }, transaction);
                }
            }

            // Log basette deletions
            if (vendita.basette) {
                for (const basetta of vendita.basette) {
                    await loggingService.logDelete('T_BASETTE', basetta.id, basetta.toJSON(), {
                        ...additionalData,
                        parent_vendita_id: vendita.id
                    }, transaction);
                }
            }

            await VenditaDettaglio.destroy({ where: { vendita_id: id }, transaction: transaction });
            await Basetta.destroy({ where: { vendita_id: id }, transaction: transaction });
            
            // Log main vendita deletion
            await loggingService.logDelete('T_VENDITE', vendita.id, vendita.toJSON(), additionalData, transaction);
            
            await Vendita.destroy({ where: { id }, transaction: transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async modificaStatoDettaglio(id, stato_avanzamento) {
        const dettaglio = await VenditaDettaglio.findByPk(id);

        if (!dettaglio) {
            throw new Error('Dettaglio non trovato');
        }
        if (stato_avanzamento == null) {
            throw new Error('Stato di avanzamento non specificato');
        }

        const oldDettaglio = dettaglio.toJSON();
        await dettaglio.update({ stato_stampa: stato_avanzamento });

        // Log the state change
        await loggingService.logUpdate('T_VENDITE_DETTAGLI', dettaglio.id, oldDettaglio, dettaglio.toJSON(), {
            operation: 'UPDATE',
            reason: 'Manual state modification'
        });

        return dettaglio;
    }

    async modificaStatoBasetta(id, stato_avanzamento) {
        const basetta = await Basetta.findByPk(id);

        if (!basetta) {
            throw new Error('Basetta non trovata');
        }
        if (stato_avanzamento == null) {
            throw new Error('Stato di avanzamento non specificato');
        }

        const oldBasetta = basetta.toJSON();
        await basetta.update({ stato_stampa: stato_avanzamento });

        // Log the state change
        await loggingService.logUpdate('T_BASETTE', basetta.id, oldBasetta, basetta.toJSON(), {
            operation: 'UPDATE',
            reason: 'Manual state modification'
        });

        return basetta;
    }

    async modificaStatoVendita(id, stato_avanzamento) {
        const vendita = await Vendita.findByPk(id);
        const dettagli = await VenditaDettaglio.findAll({ where: { vendita_id: id } });
        const basette = await Basetta.findAll({ where: { vendita_id: id } });

        const isStatoSpedizioneDaSpedire = vendita.stato_spedizione == 0;

        if (!vendita) {
            throw new Error('Vendita non trovata');
        }
        if (stato_avanzamento == null) {
            throw new Error('Stato di avanzamento non specificato');
        }

        const oldVendita = vendita.toJSON();
        await vendita.update({ stato_spedizione: stato_avanzamento });

        // Log the vendita state change
        await loggingService.logUpdate('T_VENDITE', vendita.id, oldVendita, vendita.toJSON(), {
            operation: 'UPDATE',
            reason: 'Manual vendita state modification'
        });

        if (isStatoSpedizioneDaSpedire) {
            for (const dettaglio of dettagli) {
                if (dettaglio.stato_stampa == 0) {
                    const oldDettaglio = dettaglio.toJSON();
                    await dettaglio.update({ stato_stampa: 4 });
                    
                    // Log dettaglio state change
                    await loggingService.logUpdate('T_VENDITE_DETTAGLI', dettaglio.id, oldDettaglio, dettaglio.toJSON(), {
                        operation: 'UPDATE',
                        reason: 'Automatic state change due to vendita shipping status change',
                        parent_vendita_id: vendita.id
                    });
                }
            }
            for (const basetta of basette) {
                if (basetta.stato_stampa == 0) {
                    const oldBasetta = basetta.toJSON();
                    await basetta.update({ stato_stampa: 4 });
                    
                    // Log basetta state change
                    await loggingService.logUpdate('T_BASETTE', basetta.id, oldBasetta, basetta.toJSON(), {
                        operation: 'UPDATE',
                        reason: 'Automatic state change due to vendita shipping status change',
                        parent_vendita_id: vendita.id
                    });
                }
            }
        }
        
        return vendita;
    }

    async ottieniTuttiAnni() {
        const anni = await Vendita.findAll({
            attributes: [
                [fn('strftime', '%Y', col('data_vendita')), 'anno']
            ],
            where: {
                deletedAt: null,
                data_vendita: {
                    [Op.not]: null
                }
            },
            group: [fn('strftime', '%Y', col('data_vendita'))],
            order: [[fn('strftime', '%Y', col('data_vendita')), 'DESC']]
        });

        return anni.map(a => {
            return {
                id:  a.get('anno'),
                etichetta: a.get('anno')
            }
        });
    }

    async ottieniAndamentoVendite(anno) {
        const data = {
            labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
            datasets: [
                {
                    label: 'Vendite',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(75, 197, 64, 1)',
                    borderColor: 'rgba(75, 197, 64, 0.69)',
                    borderWidth: 1,
                },
                {
                    label: 'Spese',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 0.69)',
                    borderWidth: 1,
                },
                {
                    label: 'In Sospeso',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(240, 173, 78, 1)',
                    borderColor: 'rgba(240, 173, 78, 0.69)',
                    borderWidth: 1,
                },
            ]
        };

        for (let i = 1; i <= 12; i++) {
            const dataMeseVendite = await this.ottieniAndamentoVenditaAnnoMese(anno, i);
            const dataMeseSpese = await this.ottieniAndamentoSpesaAnnoMese(anno, i);
            const dataMeseSospese = await this.ottieniAndamentoVenditaSospeseAnnoMese(anno, i);

            data.datasets[0].data[i - 1] = dataMeseVendite || 0;
            data.datasets[1].data[i - 1] = dataMeseSpese || 0;
            data.datasets[2].data[i - 1] = dataMeseSospese || 0;
        }

        const options = {
            y: {
                beginAtZero: true,
            }
        };

        return { data, options };
    }

    async ottieniAndamentoUltimiTreMesi() {
        let dataOggi = new Date();
        dataOggi.setTime( dataOggi.getTime() - dataOggi.getTimezoneOffset()*60*1000 );

        const anno = dataOggi.getFullYear();
        
        const mese = dataOggi.getMonth() + 1;
        const mesePrecedente = mese - 1;
        const mesePrecedentePrecedente = mesePrecedente - 1;

        const venditeMese = await this.ottieniAndamentoVenditaAnnoMese(anno, mese) || 0;
        const venditeMesePrecedente = await this.ottieniAndamentoVenditaAnnoMese(anno, mesePrecedente) || 0;
        const venditeMesePrecedentePrecedente = await this.ottieniAndamentoVenditaAnnoMese(anno, mesePrecedentePrecedente) || 0;

        const speseMese = await this.ottieniAndamentoSpesaAnnoMese(anno, mese) || 0;
        const speseMesePrecedente = await this.ottieniAndamentoSpesaAnnoMese(anno, mesePrecedente) || 0;
        const speseMesePrecedentePrecedente = await this.ottieniAndamentoSpesaAnnoMese(anno, mesePrecedentePrecedente) || 0;

        const totaleVendite = venditeMese + venditeMesePrecedente + venditeMesePrecedentePrecedente;
        const totaleSpese = speseMese + speseMesePrecedente + speseMesePrecedentePrecedente;

        return totaleVendite - totaleSpese;
    }

    async ottieniAndamentoUltimiTreMesiSospese() {
        let dataOggi = new Date();
        dataOggi.setTime( dataOggi.getTime() - dataOggi.getTimezoneOffset()*60*1000 );

        const anno = dataOggi.getFullYear();
        
        const mese = dataOggi.getMonth() + 1;
        const mesePrecedente = mese - 1;
        const mesePrecedentePrecedente = mesePrecedente - 1;

        const venditeMese = await this.ottieniAndamentoVenditaSospeseAnnoMese(anno, mese) || 0;
        const venditeMesePrecedente = await this.ottieniAndamentoVenditaSospeseAnnoMese(anno, mesePrecedente) || 0;
        const venditeMesePrecedentePrecedente = await this.ottieniAndamentoVenditaSospeseAnnoMese(anno, mesePrecedentePrecedente) || 0;

        return venditeMese + venditeMesePrecedente + venditeMesePrecedentePrecedente;
    }

    async ottieniAndamentoVenditaAnnoMese(anno, mese) {
        let primoGiornoMese = new Date(anno, mese - 1, 1);
        primoGiornoMese.setTime( primoGiornoMese.getTime() - primoGiornoMese.getTimezoneOffset()*60*1000 );

        let ultimoGiornoMese = new Date(anno, mese, 0);
        ultimoGiornoMese.setTime( ultimoGiornoMese.getTime() - ultimoGiornoMese.getTimezoneOffset()*60*1000 );

        const data = await Vendita.sum('totale_vendita', {
            where: {
                deletedAt: null,
                data_vendita: {
                    [Op.between]: [primoGiornoMese, ultimoGiornoMese]
                },
                stato_spedizione: 3 // Consegnato
            },
            group: [fn('strftime', '%Y', col('data_vendita')), fn('strftime', '%m', col('data_vendita'))],
        });

        return data;
    }

    async ottieniAndamentoVenditaSospeseAnnoMese(anno, mese) {
        let primoGiornoMese = new Date(anno, mese - 1, 1);
        primoGiornoMese.setTime( primoGiornoMese.getTime() - primoGiornoMese.getTimezoneOffset()*60*1000 );

        let ultimoGiornoMese = new Date(anno, mese, 0);
        ultimoGiornoMese.setTime( ultimoGiornoMese.getTime() - ultimoGiornoMese.getTimezoneOffset()*60*1000 );

        const data = await Vendita.sum('totale_vendita', {
            where: {
                deletedAt: null,
                data_vendita: {
                    [Op.between]: [primoGiornoMese, ultimoGiornoMese]
                },
                stato_spedizione: {
                    [Op.in]: [0, 1, 2]
                }
            },
            group: [fn('strftime', '%Y', col('data_vendita')), fn('strftime', '%m', col('data_vendita'))],
        });

        return data;
    }

    async ottieniAndamentoSpesaAnnoMese(anno, mese) {
        let primoGiornoMese = new Date(anno, mese - 1, 1);
        primoGiornoMese.setTime( primoGiornoMese.getTime() - primoGiornoMese.getTimezoneOffset()*60*1000 );

        let ultimoGiornoMese = new Date(anno, mese, 0);
        ultimoGiornoMese.setTime( ultimoGiornoMese.getTime() - ultimoGiornoMese.getTimezoneOffset()*60*1000 );

        const data = await Spesa.sum('totale_spesa', {
            where: {
                deletedAt: null,
                data_spesa: {
                    [Op.between]: [primoGiornoMese, ultimoGiornoMese]
                }
            },
            group: [fn('strftime', '%Y', col('data_spesa')), fn('strftime', '%m', col('data_spesa'))],
        });

        return data;
    }

    async ottieniStatoVendite() {
        const da_stampare = await this.contaVenditeConDettagliStatoStampa(0);
        const stampa_in_corso = await this.contaVenditeConDettagliStatoStampa(1);
        const terminato_senza_difetti = await this.contaVenditeConDettagliStatoStampa(4);
        const terminato_con_difetti = await this.contaVenditeConDettagliStatoStampa(5);
        const fallito = await this.contaVenditeConDettagliStatoStampa(6);
        const da_controllare = await this.contaVenditeConDettagliStatoStampa(7);
        const da_spedire = await this.contaVenditeConStatoSpedizione(0);
        const spedizione_in_corso = await this.contaVenditeConStatoSpedizione(1);
        const spedizione_terminata_parzialmente = await this.contaVenditeConStatoSpedizione(2);
        const spedizione_terminata_completamente = await this.contaVenditeConStatoSpedizione(3);
        const spedizione_fallita = await this.contaVenditeConStatoSpedizione(4);
        const in_scadenza = await this.contaVenditeInScadenza();
        const scadute = await this.contaVenditeScadute();

        return {
            da_stampare,
            stampa_in_corso,
            terminato_senza_difetti,
            terminato_con_difetti,
            fallito,
            da_controllare,
            da_spedire,
            spedizione_in_corso,
            spedizione_terminata_parzialmente,
            spedizione_terminata_completamente,
            spedizione_fallita,
            in_scadenza,
            scadute
        };
    }

    async contaVenditeConDettagliStatoStampa(stato_stampa) {
        return VenditaDettaglio.count({
            where: {
                stato_stampa: stato_stampa
            }
        });
    }

    async contaVenditeConStatoSpedizione(stato_spedizione) {
        return Vendita.count({
            where: {
                stato_spedizione: stato_spedizione
            }
        });
    }

    async contaVenditeInScadenza() {
        let dataOggi = new Date();

        return Vendita.count({
            where: {
                data_scadenza: { [Op.lte]: dataOggi },
                data_scadenza_spedizione: { [Op.gt]: dataOggi },
                stato_spedizione: { [Op.in]: [0, 4] }
            }
        });
    }

    async contaVenditeScadute() {
        let dataOggi = new Date();

        return Vendita.count({
            where: {
                data_scadenza_spedizione: { [Op.lte]: dataOggi },
                stato_spedizione: { [Op.in]: [0, 4] }
            }
        });
    }

    async sommaVenditePerContoBancarioAnno(anno, conto_bancario_id) {
        const primoGiornoAnno = new Date(anno, 0, 1);
        const ultimoGiornoAnno = new Date(anno, 11, 31);

        return Vendita.sum('totale_vendita', {
            where: {
                deletedAt: null,
                data_vendita: { [Op.between]: [primoGiornoAnno, ultimoGiornoAnno] },
                conto_bancario_id: conto_bancario_id
            }
        });
    }

    async ottieniRiepilogoVenditeModelliPerMese(anno) {
        const primoGiornoAnno = new Date(anno, 0, 1);
        const ultimoGiornoAnno = new Date(anno, 11, 31);

        // Fetch all delivered sales for the year, including their details and model
        const vendite = await Vendita.findAll({
            where: {
                deletedAt: null,
                data_vendita: { [Op.between]: [primoGiornoAnno, ultimoGiornoAnno] },
                stato_spedizione: 3 // Consegnato
            },
            include: [
                {
                    model: VenditaDettaglio,
                    as: 'dettagli',
                    required: true,
                    include: [
                        {
                            association: 'modello',
                            attributes: ['id','nome', 'tipo']
                        }
                    ]
                }
            ]
        });

        // Italian month names
        const mesi = [
            'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
            'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
        ];

        // Prepare 12 months
        const result = Array.from({ length: 12 }, () => ({}));

        // Aggregate
        vendite.forEach(vendita => {
            const month = new Date(vendita.data_vendita).getMonth(); // 0-based

            if (!vendita.dettagli) {
                return;
            }

            vendita.dettagli.forEach(dettaglio => {
                if (dettaglio.modello == null) {
                    return;
                }

                const modello_nome = dettaglio.modello.nome;
                const tipo = dettaglio.modello.tipo;
                const prezzo = parseFloat(dettaglio.prezzo) || 0;

                const key = dettaglio.modello.id;
                if (!result[month][key]) {
                    result[month][key] = {
                        modello_nome,
                        tipo,
                        quantita: 0,
                        prezzo_totale: 0
                    };
                }
                result[month][key].quantita += dettaglio.quantita;
                result[month][key].prezzo_totale += prezzo;
            });
        });

        // Normalize to a flat array
        const normalized = [];
        result.forEach((monthObj, idx) => {
            Object.values(monthObj)
                .sort((a, b) => b.prezzo_totale - a.prezzo_totale)
                .forEach(modello => {
                    normalized.push({
                        mese_numero: idx,
                        mese: mesi[idx],
                        modello_nome: modello.modello_nome,
                        tipo: modello.tipo,
                        quantita: modello.quantita,
                        prezzo_totale: modello.prezzo_totale
                    });
                });
        });

        return normalized;
    }

    async modificaContoBancarioVendite(vendite_ids, conto_bancario_id) {
        const vendite = await Vendita.findAll({ where: { id: { [Op.in]: vendite_ids } } });
        
        for (const vendita of vendite) {
            const oldContoBancarioId = vendita.conto_bancario_id;
            await vendita.update({ conto_bancario_id: conto_bancario_id });
            
            // Log the conto bancario change
            await loggingService.logUpdate('T_VENDITE', vendita.id, 'conto_bancario_id', oldContoBancarioId, conto_bancario_id, {
                operation: 'BULK_UPDATE',
                reason: 'Bulk update of bank account for multiple sales',
                affected_records: vendite_ids.length
            });
        }
    }

    async updateEtichettaSpedizione(venditaId, filePath) {
        const vendita = await Vendita.findByPk(venditaId);
        if (!vendita) {
            throw new Error('Vendita non trovata');
        }

        const oldFilePath = vendita.etichetta_spedizione;
        await vendita.update({ etichetta_spedizione: filePath });

        // Log the update
        await loggingService.logUpdate('T_VENDITE', venditaId, 'etichetta_spedizione', oldFilePath, filePath, {
            operation: 'UPDATE',
            reason: 'Etichetta spedizione file upload/update'
        });

        return vendita;
    }
}

// Create a singleton instance
const venditaRepository = new VenditaRepository();

export default venditaRepository; 