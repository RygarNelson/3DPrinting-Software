'use strict'

import Modello from '../models/modello.model.js';
import VenditaDettaglio from '../models/venditaDettaglio.model.js';
import BaseRepository from './base.repository.js';

class ModelloRepository extends BaseRepository {
    constructor() {
        super(Modello, 'T_MODELLI');
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
            descrizione: req.body.descrizione,
            tipo: req.body.tipo,
            basetta_dimensione: req.body.basetta_dimensione,
            basetta_quantita: req.body.basetta_quantita,
            vinted_vendibile: req.body.vinted_vendibile,
            vinted_is_in_vendita: req.body.vinted_is_in_vendita
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
            descrizione: req.body.descrizione,
            tipo: req.body.tipo,
            basetta_dimensione: req.body.basetta_dimensione,
            basetta_quantita: req.body.basetta_quantita,
            vinted_vendibile: req.body.vinted_vendibile,
            vinted_is_in_vendita: req.body.vinted_is_in_vendita
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
        const isDettaglioVendita = await VenditaDettaglio.findOne({ where: { modello_id: id } });
        return isDettaglioVendita ? true : false;
    }

    async impostaInVenditaVinted(id) {
        const additionalData = {
            operation: 'VINTED_STATUS_UPDATE',
            reason: 'Setting model as in sale on Vinted'
        };
        return super.updateOne(id, { vinted_is_in_vendita: true }, additionalData);
    }
}

// Create a singleton instance
const modelloRepository = new ModelloRepository();

export default modelloRepository;