'use strict'

import Stampante from '../models/stampante.model.js';

const stampanteRepository = {
    getAll: function () {
        return Stampante.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return Stampante.findAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection });
    },

    count: function(searchExample) {
        return Stampante.count({ where: searchExample });
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
    }
};

export default stampanteRepository;