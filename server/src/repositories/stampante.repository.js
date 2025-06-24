'use strict'

import Stampante from '../models/stampante.model.js';
import VenditaDettaglio from '../models/venditaDettaglio.model.js';

const stampanteRepository = {
    getAll: function () {
        return Stampante.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return Stampante.findAndCountAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection, distinct: true });
    },

    findOne: function(id, projection) {
        return Stampante.findOne({ where: {
            id: id
        }, attributes: projection });
    },

    insertOne: function(req, res) {
        return Stampante.create({
            nome: req.body.nome,
            descrizione: req.body.descrizione
        });
    },

    updateOne: function(req, res) {
        return Stampante.update({
            nome: req.body.nome,
            descrizione: req.body.descrizione
        }, {
            where: { id: req.body.id }
        });
    },

    deleteOne: function(id) {
        return Stampante.destroy({ where: { id: id } });
    },

    isUsed: async function(id) {
        const isDettaglioVendita = await VenditaDettaglio.findOne({ where: { stampante_id: id } });
        return isDettaglioVendita ? true : false;
    }
};

export default stampanteRepository;