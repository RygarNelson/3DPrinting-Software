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
            tipo: req.body.tipo
        });
    },

    updateOne: function(req, res) {
        return Modello.update({
            nome: req.body.nome,
            descrizione: req.body.descrizione,
            tipo: req.body.tipo
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