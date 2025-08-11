'use strict'

import jwt from 'jsonwebtoken';
import { secret } from '../config/jwtOptions.js';
import loggingService from '../services/logging.service.js';

/**
 * Middleware to set logging context from HTTP request
 * This should be used after authentication middleware
 */
const setLoggingContext = (req, res, next) => {
    try {
        // Extract user information from request
        let user = null;
        const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || null;
        const user_agent = req.headers['user-agent'] || null;

        if (req.headers.token) {
            try {
                let verification = jwt.verify(req.headers.token, secret)
                if (verification) {
                    user = {
                        id: verification.username.id,
                        name: verification.username.name,
                        surname: verification.username.surname,
                        email: verification.username.email,
                        role: verification.username.role
                    }
                }
            }
            catch (err) {
                console.error('Error verifying token:', err);
            }
        }

        // Set context in logging service
        loggingService.setContext({
            user,
            ip_address,
            user_agent
        });

        next();
    } catch (error) {
        console.error('Error setting logging context:', error);
        next(); // Continue even if logging context fails
    }
};

/**
 * Middleware to clear logging context after request
 * This should be used as the last middleware
 */
const clearLoggingContext = (req, res, next) => {
    try {
        // Clear context after request is complete
        res.on('finish', () => {
            loggingService.clearContext();
        });
        
        next();
    } catch (error) {
        console.error('Error clearing logging context:', error);
        next(); // Continue even if clearing context fails
    }
};

export { clearLoggingContext, setLoggingContext };

