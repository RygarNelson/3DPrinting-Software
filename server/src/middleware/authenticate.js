'use strict'

import jwt from 'jsonwebtoken'
import { secret } from '../config/jwtOptions.js'

const authenticate = async (req, res, next) => {
    if (req.headers.token) {
        try {
            let verification = jwt.verify(req.headers.token, secret)
            if (verification) {
                return next();
            } else {
                res.status(401).json({
                    success: false,
                    error: 'Il token non è valido'
                });
            }
        }
        catch (err) {
            res.status(401).json({
                success: false,
                error: 'Il token non è valido'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            error: 'Nessun token trovato'
        });
    }
}

export { authenticate }
