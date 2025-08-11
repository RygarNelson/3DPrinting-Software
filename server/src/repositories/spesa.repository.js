'use strict'

import Spesa from '../models/spesa.model.js';
import BaseRepository from './base.repository.js';

class SpesaRepository extends BaseRepository {
    constructor() {
        super(Spesa, 'T_SPESE');
    }

    getAll() {
        return super.getAll();
    }

    findOne(id, projection) {
        return super.findOne(id, projection);
    }

    find(whereOptions, limit, offset, order, projection) {
        return super.find(whereOptions, limit, offset, order, projection);
    }

    async insertOne(req) {
        const data = {
            data_spesa: req.body.data_spesa,
            totale_spesa: req.body.totale_spesa,
            descrizione: req.body.descrizione,
            quantita: req.body.quantita,
            tipo_spesa: req.body.tipo_spesa,
            unita_misura: req.body.unita_misura
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
            data_spesa: req.body.data_spesa,
            totale_spesa: req.body.totale_spesa,
            descrizione: req.body.descrizione,
            quantita: req.body.quantita,
            tipo_spesa: req.body.tipo_spesa,
            unita_misura: req.body.unita_misura
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
}

// Create a singleton instance
const spesaRepository = new SpesaRepository();

export default spesaRepository;