'use strict'

const mongoose = require('mongoose');
const Users = require('../models/users.model');

const authMethods = require('../methods/authMethods');

module.exports = {
    insertOne: function(req, res) {
        let user = new Users({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: authMethods.encryptPassword(req.body.password),
            role: req.body.role
        });

        user
        .save()
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: 'Account creato con successo!',
                technical_data: data
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante la creazione dell'account",
                technical_data: error.toString()
            });
        })
    },

    findOne: function(searchExample) {
        return Users.findOne(searchExample);
    }
}
