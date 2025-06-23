'use strict'

import express from 'express';
import { body, validationResult } from 'express-validator';
import authMethods from '../methods/authMethods.js';
import UsersRepository from '../repositories/users.repository.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post(
    '/login',
    body('email').isEmail().notEmpty(),
    body('password').escape().notEmpty(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Email o password invalidi!',
                technical_data: errors
            });
        }
        const user = await UsersRepository.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Email o password invalidi!'
            });
        }
        if (authMethods.comparePasswords(req.body.password, user.password)) {
            return res.status(200).json({
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
            return res.status(400).json({
                success: false,
                error: 'Email o password invalidi!'
            });
        }
    })
);

router.post(
    '/register',
    body('name').escape().notEmpty(),
    body('surname').escape().notEmpty(),
    body('email').isEmail().notEmpty(),
    body('password').escape().notEmpty(),
    body('role').isNumeric().notEmpty(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'One or more values are invalid.',
                technical_data: errors.errors
            });
        }
        await UsersRepository.insertOne(req, res);
    })
);

router.post('/checkToken', asyncHandler(async (req, res) => {
    if (authMethods.checkToken(req.body.token)) {
        res.status(200).json({
            success: true,
            data: "Valid token"
        });
    } else {
        res.status(401).json({
            success: false,
            error: "Not a valid token"
        });
    }
}));

export default router;
