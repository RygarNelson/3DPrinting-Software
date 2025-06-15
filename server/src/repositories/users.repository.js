'use strict'

import User from '../models/users.model.js';
import authMethods from '../methods/authMethods.js';

const usersRepository = {
    insertOne: function(req, res) {
        User.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: authMethods.encryptPassword(req.body.password),
            role: req.body.role
        })
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
        });
    },

    findOne: function(searchExample) {
        return User.findOne({ where: searchExample });
    }
};

export default usersRepository;
