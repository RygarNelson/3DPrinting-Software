'use strict'

import ContoBancario from '../models/conto-bancario.model.js';
import Vendita from '../models/vendita.model.js';
import BaseRepository from './base.repository.js';

class ContoBancarioRepository extends BaseRepository {
    constructor() {
        super(ContoBancario, 'T_CONTI_BANCARI');
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
        const data = {
            nome_proprietario: req.body.nome_proprietario,
            cognome_proprietario: req.body.cognome_proprietario,
            iban: req.body.iban
        };

        const additionalData = {
            request_source: 'HTTP',
            endpoint: req.originalUrl,
            method: req.method
        };

        return super.insertOne(data, additionalData);
    }

    async updateOne(req, res) {
        const data = {
            nome_proprietario: req.body.nome_proprietario,
            cognome_proprietario: req.body.cognome_proprietario,
            iban: req.body.iban
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
        try {
            const isVendita = await Vendita.findOne({ where: { conto_bancario_id: id, deletedAt: null } });
            return isVendita ? true : false;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
}

// Create a singleton instance
const contoBancarioRepository = new ContoBancarioRepository();

export default contoBancarioRepository;