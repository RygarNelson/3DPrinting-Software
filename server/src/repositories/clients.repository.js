'use strict'

const mongoose = require('mongoose');
const Clients = require("../models/clients.model");

module.exports = {
    getAll: function () {
        return Clients.find();
    },

    find: function(searchExample) {
        return Clients.find(searchExample);
    },

    findOne: function(searchExample) {
        return Clients.findOne(searchExample);
    },

    insertOne: function(req, res) {
        let client = new Clients({
            _id: new mongoose.Types.ObjectId(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            companyname: req.body.companyname,
            phone: req.body.phone,
            email: req.body.email
        });

        client
        .save()
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
        let client = new Clients({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            companyname: req.body.companyname,
            phone: req.body.phone,
            email: req.body.email
        });

        Clients
        .findByIdAndUpdate(req.body._id, client)
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
        return Clients.findByIdAndDelete(id);
    }
}