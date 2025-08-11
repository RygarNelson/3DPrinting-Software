'use strict'

import { Op } from 'sequelize';
import Cliente from '../models/cliente.model.js';
import Vendita from '../models/vendita.model.js';
import BaseRepository from './base.repository.js';

class ClienteRepository extends BaseRepository {
    constructor() {
        super(Cliente, 'T_CLIENTI');
    }

    getAll() {
        return super.getAll();
    }

    find(searchExample, limit, offset, order, projection) {
        return super.find(searchExample, limit, offset, order, projection);
    }

    findOne(id, projection) {
        return super.findOne(id, projection);
    }

    async insertOne(req, res) {
        const nome = req.body.nome ? req.body.nome.trim() : '';
        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
        let etichetta = '';
        if (nome && cognome) {
            etichetta = nome + ' ' + cognome;
        } else {
            etichetta = ragione_sociale;
        }
        
        const data = {
            nome: nome,
            cognome: cognome,
            ragione_sociale: ragione_sociale,
            email: req.body.email,
            telefono: req.body.telefono,
            etichetta: etichetta
        };

        const additionalData = {
            request_source: 'HTTP',
            endpoint: req.originalUrl,
            method: req.method
        };

        return super.insertOne(data, additionalData);
    }

    async updateOne(req, res) {
        const nome = req.body.nome ? req.body.nome.trim() : '';
        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
        let etichetta = '';
        if (nome && cognome) {
            etichetta = nome + ' ' + cognome;
        } else {
            etichetta = ragione_sociale;
        }
        
        const data = {
            nome: nome,
            cognome: cognome,
            ragione_sociale: ragione_sociale,
            email: req.body.email,
            telefono: req.body.telefono,
            etichetta: etichetta
        };

        const additionalData = {
            request_source: 'HTTP',
            endpoint: req.originalUrl,
            method: req.method
        };

        return super.updateOne(req.body.id, data, additionalData);
    }

    async deleteOne(id) {
        const additionalData = {
            request_source: 'HTTP',
            operation: 'DELETE'
        };
        return super.deleteOne(id, additionalData);
    }

    async isUsed(id) {
        const isVendita = await Vendita.findOne({ where: { cliente_id: id } });
        return isVendita ? true : false;
    }

    async getClienteVintedId() {
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
            const data = {
                nome: null,
                cognome: null,
                ragione_sociale: 'Vinted',
                email: null,
                telefono: null,
                etichetta: 'Vinted'
            };

            const additionalData = {
                operation: 'AUTO_CREATE',
                reason: 'Vinted client not found, creating automatically'
            };

            const clienteNuovo = await super.insertOne(data, additionalData);
            vintedId = clienteNuovo.id;
        }

        return vintedId;
    }
}

// Create a singleton instance
const clienteRepository = new ClienteRepository();

export default clienteRepository; 