'use strict'

import ContoBancario from '../models/conto-bancario.model.js';
import Vendita from '../models/vendita.model.js';

const contoBancarioRepository = {
    getAll: function () {
        return ContoBancario.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return ContoBancario.findAndCountAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection, distinct: true });
    },

    findOne: function(id, projection) {
        return ContoBancario.findOne({ where: {
            id: id
        }, attributes: projection });
    },

    insertOne: function(req, res) {
        return ContoBancario.create({
            nome_proprietario: req.body.nome_proprietario,
            cognome_proprietario: req.body.cognome_proprietario,
            iban: req.body.iban
        });
    },

    updateOne: function(req, res) {
        return ContoBancario.update({
            nome_proprietario: req.body.nome_proprietario,
            cognome_proprietario: req.body.cognome_proprietario,
            iban: req.body.iban
        }, {
            where: { id: req.body.id }
        });
    },

    deleteOne: function(id) {
        return ContoBancario.destroy({ where: { id: id } });
    },

    isUsed: async function(id) {
        const isVendita = await Vendita.findOne({ where: { conto_bancario_id: id } });
        return isVendita ? true : false;
    }
};

export default contoBancarioRepository;