'use strict'

import { Op } from 'sequelize';
import Cliente from '../models/cliente.model.js';
import Vendita from '../models/vendita.model.js';

const clienteRepository = {
    getAll: function () {
        return Cliente.findAll();
    },

    find: function(searchExample, limit, offset, order, projection) {
        return Cliente.findAndCountAll({ where: searchExample, limit: limit, offset: offset, order: order, attributes: projection, distinct: true });
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
    },

    isUsed: async function(id) {
        const isVendita = await Vendita.findOne({ where: { cliente_id: id } });
        return isVendita ? true : false;
    },

    getClienteVintedId: async function() {
        let vintedId = null;
        
        const cliente = await Cliente.findOne({ where: 
            {
                ragione_sociale: {
                    [Op.like]: '%vinted%'
                },
                deletedAt: null
            }
        });

        if (cliente) {
            vintedId = cliente.id;
        } else {
            const clienteNuovo = await Cliente.create({
                nome: null,
                cognome: null,
                ragione_sociale: 'Vinted',
                email: null,
                telefono: null,
                etichetta: 'Vinted'
            });

            vintedId = clienteNuovo.id;
        }

        return vintedId;
    }
};

export default clienteRepository; 