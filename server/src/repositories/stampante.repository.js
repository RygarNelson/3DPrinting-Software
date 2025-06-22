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
        Stampante.create({
            nome: req.body.nome,
            descrizione: req.body.descrizione
        })
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: 'Stampante creata con successo!',
                technical_data: data
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante la creazione della stampante",
                technical_data: error.toString()
            });
        });
    },

    updateOne: function(req, res) {
        Stampante.update({
            nome: req.body.nome,
            descrizione: req.body.descrizione
        }, {
            where: { id: req.body.id }
        })
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: 'Stampante modificata con successo!',
                technical_data: data
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante la modifica della stampante",
                technical_data: error.toString()
            });
        });
    },

    deleteOne: function(id) {
        return Stampante.destroy({ where: { id: id } });
    }
};

export default stampanteRepository;