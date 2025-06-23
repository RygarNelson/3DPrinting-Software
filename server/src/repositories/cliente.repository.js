'use strict'

import Cliente from '../models/cliente.model.js';

const clienteRepository = {
    getAll: function () {
        return Cliente.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return Cliente.findAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection });
    },

    count: function(searchExample) {
        return Cliente.count({ where: searchExample });
    },

    findOne: function(id, projection) {
        return Cliente.findOne({ where: { id: id }, attributes: projection });
    },

    insertOne: function(req, res) {
        const nome = req.body.nome ? req.body.nome.trim() : '';
        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
        let etichetta = '';
        if (nome && cognome) {
            etichetta = nome + ' ' + cognome;
        } else {
            etichetta = ragione_sociale;
        }
        return Cliente.create({
            nome: nome,
            cognome: cognome,
            ragione_sociale: ragione_sociale,
            email: req.body.email,
            telefono: req.body.telefono,
            etichetta: etichetta
        });
    },

    updateOne: function(req, res) {
        const nome = req.body.nome ? req.body.nome.trim() : '';
        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
        let etichetta = '';
        if (nome && cognome) {
            etichetta = nome + ' ' + cognome;
        } else {
            etichetta = ragione_sociale;
        }
        return Cliente.update({
            nome: nome,
            cognome: cognome,
            ragione_sociale: ragione_sociale,
            email: req.body.email,
            telefono: req.body.telefono,
            etichetta: etichetta
        }, {
            where: { id: req.body.id }
        });
    },

    deleteOne: function(id) {
        return Cliente.destroy({ where: { id: id } });
    }
};

export default clienteRepository; 