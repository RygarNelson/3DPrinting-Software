'use strict'

import Spesa from '../models/spesa.model.js';

const spesaRepository = {
    getAll: function () {
        return Spesa.findAll();
    },

    findOne: function(id, projection) {
        return Spesa.findOne({ where: { id }, attributes: projection });
    },

    find: function(whereOptions, limit, offset, order, projection) {
        return Spesa.findAndCountAll({
            where: whereOptions,
            attributes: projection,
            limit: limit,
            offset: offset,
            order: order,
            distinct: true
        });
    },

    insertOne: function(req) {
        return Spesa.create({
            data_spesa: req.body.data_spesa,
            totale_spesa: req.body.totale_spesa,
            descrizione: req.body.descrizione
        }); 
    },

    updateOne: function(req, res) {
        return Spesa.update({
            data_spesa: req.body.data_spesa,
            totale_spesa: req.body.totale_spesa,
            descrizione: req.body.descrizione
        }, {
            where: { id: req.body.id }
        });
    },

    deleteOne: function(id) {
        return Spesa.destroy({ where: { id: id } });
    }
}

export default spesaRepository;