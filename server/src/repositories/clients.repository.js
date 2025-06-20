'use strict'

import Client from '../models/clients.model.js';

const clientsRepository = {
    getAll: function () {
        return Client.findAll();
    },

    find: function(searchExample) {
        return Client.findAll({ where: searchExample });
    },

    findOne: function(searchExample) {
        return Client.findOne({ where: searchExample });
    },

    insertOne: function(req, res) {
        Client.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            companyname: req.body.companyname,
            phone: req.body.phone,
            email: req.body.email
        })
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: 'Cliente creato con successo!',
                technical_data: data
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante la creazione del cliente",
                technical_data: error.toString()
            });
        });
    },

    updateOne: function(req, res) {
        Client.update({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            companyname: req.body.companyname,
            phone: req.body.phone,
            email: req.body.email
        }, {
            where: { id: req.body.id }
        })
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: 'Cliente modificato con successo!',
                technical_data: data
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante la modifica del cliente",
                technical_data: error.toString()
            });
        });
    },

    deleteOne: function(id) {
        return Client.destroy({ where: { id: id } });
    }
};

export default clientsRepository;