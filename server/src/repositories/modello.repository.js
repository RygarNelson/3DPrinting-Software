'use strict'

import Modello from '../models/modello.model.js';

const modelloRepository = {
    getAll: function () {
        return Modello.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return Modello.findAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection });
    },

    count: function(searchExample) {
        return Modello.count({ where: searchExample });
    },

    findOne: function(id, projection) {
        return Modello.findOne({ where: {
            id: id
        }, attributes: projection });
    },

    insertOne: function(req, res) {
        return Modello.create({
            nome: req.body.nome,
            descrizione: req.body.descrizione
        });
    },

    updateOne: function(req, res) {
        return Modello.update({
            nome: req.body.nome,
            descrizione: req.body.descrizione
        }, {
            where: { id: req.body.id }
        });
    },

    deleteOne: function(id) {
        return Modello.destroy({ where: { id: id } });
    }
};

export default modelloRepository;