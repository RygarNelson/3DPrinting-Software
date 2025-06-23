'use strict'

import { sequelize } from '../config/database.js';
import Vendita from '../models/vendita.model.js';
import VenditaDettaglio from '../models/venditaDettaglio.model.js';

const venditaRepository = {
    getAll: function () {
        return Vendita.findAll({
            include: [
                { association: 'dettagli', where: { deletedAt: null }, required: false },
                { association: 'cliente', where: { deletedAt: null }, required: false }
            ]
        });
    },

    findOne: function(id, projection, include) {
        return Vendita.findOne({ where: { id }, attributes: projection, include: include });
    },

    find: function(whereOptions, limit, offset, order, projection) {
        return Vendita.findAll({
            where: whereOptions,
            attributes: projection,
            limit: limit,
            offset: offset,
            order: order,
            include: [
                { association: 'cliente', where: { deletedAt: null }, required: false }
            ]
        });
    },

    count: function(whereOptions) {
        return Vendita.count({ where: whereOptions });
    },

    insertOne: async function(req) {
        const t = await sequelize.transaction();
        try {
            const { data_vendita, data_scadenza, cliente_id, dettagli } = req.body;
            const vendita = await Vendita.create({
                data_vendita,
                data_scadenza,
                cliente_id
            }, { transaction: t });

            let totale = 0;
            if (Array.isArray(dettagli)) {
                for (const d of dettagli) {
                    const det = await VenditaDettaglio.create({
                        vendita_id: vendita.id,
                        modello_id: d.modello_id,
                        quantita: d.quantita,
                        prezzo: d.prezzo
                    }, { transaction: t });
                    if (d.quantita && d.prezzo) {
                        totale += parseFloat(d.quantita) * parseFloat(d.prezzo);
                    }
                }
            }
            await vendita.update({ totale_vendita: totale }, { transaction: t });
            await t.commit();
        } catch (error) {
            await t.rollback();
        }
    },

    updateOne: async function(req) {
        const t = await sequelize.transaction();
        try {
            const { id, data_vendita, data_scadenza, cliente_id, dettagli } = req.body;
            const vendita = await Vendita.findByPk(id, { include: [{ model: VenditaDettaglio, as: 'dettagli' }], transaction: t });
            if (!vendita) throw new Error('Vendita non trovata');
            await vendita.update({ data_vendita, data_scadenza, cliente_id }, { transaction: t });

            // Handle dettagli
            const existingDettagli = vendita.dettagli || [];
            const dettagliMap = new Map();
            if (Array.isArray(dettagli)) {
                for (const d of dettagli) {
                    if (d.id) dettagliMap.set(d.id, d);
                }
            }
            // Update or delete existing dettagli
            for (const det of existingDettagli) {
                if (dettagliMap.has(det.id)) {
                    const d = dettagliMap.get(det.id);
                    await det.update({ modello_id: d.modello_id, quantita: d.quantita, prezzo: d.prezzo }, { transaction: t });
                    dettagliMap.delete(det.id);
                } else {
                    await det.destroy({ transaction: t });
                }
            }
            // Insert new dettagli
            let totale = 0;
            if (Array.isArray(dettagli)) {
                for (const d of dettagli) {
                    if (!d.id) {
                        await VenditaDettaglio.create({
                            vendita_id: vendita.id,
                            modello_id: d.modello_id,
                            quantita: d.quantita,
                            prezzo: d.prezzo
                        }, { transaction: t });
                    }
                    if (d.quantita && d.prezzo) {
                        totale += parseFloat(d.quantita) * parseFloat(d.prezzo);
                    }
                }
            }
            await vendita.update({ totale_vendita: totale }, { transaction: t });
            await t.commit();
        } catch (error) {
            await t.rollback();
        }
    },

    deleteOne: async function(id) {
        const t = await sequelize.transaction();
        try {
            await VenditaDettaglio.destroy({ where: { vendita_id: id }, transaction: t });
            await Vendita.destroy({ where: { id }, transaction: t });
            await t.commit();
        } catch (error) {
            await t.rollback();
        }
    }
};

export default venditaRepository; 