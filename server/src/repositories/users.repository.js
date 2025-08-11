'use strict'

import authMethods from '../methods/authMethods.js';
import User from '../models/users.model.js';
import BaseRepository from './base.repository.js';

class UsersRepository extends BaseRepository {
    constructor() {
        super(User, 'T_USERS');
    }

    async insertOne(req, res) {
        const data = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: authMethods.encryptPassword(req.body.password),
            role: req.body.role
        };

        const additionalData = {
            request_source: 'HTTP',
            endpoint: req.originalUrl,
            method: req.method
        };

        try {
            const result = await super.insertOne(data, additionalData);
            
            return res.status(200).json({
                success: true,
                data: 'Account creato con successo!',
                technical_data: result
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false,
                error: "Errore durante la creazione dell'account",
                technical_data: error.toString()
            });
        }
    }

    findOne(searchExample) {
        return User.findOne({ where: searchExample });
    }
}

// Create a singleton instance
const usersRepository = new UsersRepository();

export default usersRepository;
