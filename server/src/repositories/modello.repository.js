'use strict'

import Modello from '../models/modello.model.js';
import VenditaDettaglio from '../models/venditaDettaglio.model.js';

const modelloRepository = {
    getAll: function () {
        return Modello.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return Modello.findAndCountAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection, distinct: true });
    },

    findOne: function(id, projection) {
        return Modello.findOne({ where: {
            id: id
        }, attributes: projection });
    },

    insertOne: function(req, res) {
        return Modello.create({
            nome: req.body.nome,
            descrizione: req.body.descrizione,
            tipo: req.body.tipo,
            basetta_dimensione: req.body.basetta_dimensione,
            basetta_quantita: req.body.basetta_quantita,
            vinted_vendibile: req.body.vinted_vendibile,
            vinted_is_in_vendita: req.body.vinted_is_in_vendita
        });
    },

    updateOne: function(req, res) {
        return Modello.update({
            nome: req.body.nome,
            descrizione: req.body.descrizione,
            tipo: req.body.tipo,
            basetta_dimensione: req.body.basetta_dimensione,
            basetta_quantita: req.body.basetta_quantita,
            vinted_vendibile: req.body.vinted_vendibile,
            vinted_is_in_vendita: req.body.vinted_is_in_vendita
        }, {
            where: { id: req.body.id }
        });
    },

    deleteOne: function(id) {
        return Modello.destroy({ where: { id: id } });
    },

    isUsed: async function(id) {
        const isDettaglioVendita = await VenditaDettaglio.findOne({ where: { modello_id: id } });
        return isDettaglioVendita ? true : false;
    }
};

export default modelloRepository;