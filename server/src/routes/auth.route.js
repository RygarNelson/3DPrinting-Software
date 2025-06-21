'use strict'

import express from 'express';
import { body, validationResult } from 'express-validator';
import UsersRepository from '../repositories/users.repository.js';
import authMethods from '../methods/authMethods.js';

const router = express.Router();

router.post(
    '/login',
    body('email').isEmail().notEmpty(),
    body('password').escape().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Email o password invalidi!',
                technical_data: errors
            });
        } else {
            UsersRepository.findOne({email: req.body.email})
                .then((user) => {
                    if (!user) {
                        res.status(400).json({
                            success: false,
                            error: 'Email o password invalidi!'
                        });
                    } else {
                        //Check for password
                        if (authMethods.comparePasswords(req.body.password, user.password)) {
                            res.status(200).json({
                                success: true,
                                data: {
                                    id: user.id,
                                    name: user.name,
                                    surname: user.surname,
                                    email: user.email,
                                    role: user.role,
                                    token: authMethods.createJwtToken(authMethods.createJwtPayload(user))
                                }
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                error: 'Email o password invalidi!'
                            });
                        }
                    }
                })
                .catch((error) => {
                    return res.status(400).json({
                        success: false,
                        error: 'Email o password invalidi!',
                        technical_data: error
                    });
                });
        }
    }
);

router.post(
    '/register',
    body('name').escape().notEmpty(),
    body('surname').escape().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('password').escape().notEmpty(),
    body('role').isNumeric().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'One or more values are invalid.',
                technical_data: errors.errors
            });
        } else {
            UsersRepository.insertOne(req, res);
        }
    }
);

router.post('/checkToken', async (req, res) => {
    if (authMethods.checkToken(req.body.token)) {
        res.send({
            success: true,
            data: "Valid token"
        });
    } else {
        res.send({
            success: false,
            error: "Not a valid token"
        });
    }
});

export default router;
