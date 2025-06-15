'use strict'

const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const { authenticate } = require('../middleware/authenticate');

const ClientsRepository = require("../repositories/clients.repository");
const validationSchema = require("../schemas/clients.schema");

/* Authentication middleware */
router.use(authenticate);

router.get(
    '/',
    async (req, res) => {
        ClientsRepository
        .getAll()
        .then((clients) => {
            res.status(200).json({
                success: true,
                data: clients
            });
        })
        .catch((error) => {
            return res.status(400).json({
                success: false,
                error: 'Errore nel trovare i clienti!',
                technical_data: error
            });
        });
    }
);

router.post(
    '/',
    validationSchema.check(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Uno o più campi non sono validi',
                technical_data: errors.errors
            });
        } else {
            ClientsRepository.insertOne(req, res);
        }
    }
);

router.put(
    '/',
    validationSchema.check(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Uno o più campi non sono validi',
                technical_data: errors.errors
            });
        } else {
            ClientsRepository.updateOne(req, res);
        }
    }
);

router.delete(
    '/:id',
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Uno o più campi non sono validi',
                technical_data: errors.errors
            });
        } else {
            ClientsRepository
            .deleteOne(req.params.id)
            .then((data) => {
                return res.status(200).json({
                    success: true,
                    data: 'Cliente eliminato con successo!',
                    technical_data: data
                });
            })
            .catch((error) => {
                console.log(error);
                return res.status(400).json({
                    success: false,
                    error: "Errore durante l'eliminazione del cliente",
                    technical_data: error.toString()
                });
            });
        }
    }
);

module.exports = router