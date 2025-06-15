'use strict'

const jwt = require('jsonwebtoken')

const { secret } = require('../config/jwtOptions')

const authenticate = async (req, res, next) => {
    if (req.headers.token) {
        try {
            let verification = jwt.verify(req.headers.token, secret)
            if (verification) {
                return next();
            } else {
                res.send({
                    success: false,
                    error: 'Il token non è valido'
                });
            }
        }
        catch (err) {
            res.send({
                success: false,
                error: 'Il token non è valido'
            });
        }
    } else {
        res.send({
            success: false,
            error: 'Nessun token trovato'
        });
    }
}

module.exports = { authenticate }