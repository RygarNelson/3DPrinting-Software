'use strict'

import Stampante from '../models/stampante.model.js';
import VenditaDettaglio from '../models/venditaDettaglio.model.js';
import BaseRepository from './base.repository.js';

class StampanteRepository extends BaseRepository {
    constructor() {
        super(Stampante, 'T_STAMPANTI');
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
            nome: req.body.nome,
            descrizione: req.body.descrizione
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
            nome: req.body.nome,
            descrizione: req.body.descrizione
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
        const isDettaglioVendita = await VenditaDettaglio.findOne({ where: { stampante_id: id } });
        return isDettaglioVendita ? true : false;
    }
}

// Create a singleton instance
const stampanteRepository = new StampanteRepository();

export default stampanteRepository;