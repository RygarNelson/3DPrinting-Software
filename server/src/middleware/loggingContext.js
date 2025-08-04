'use strict'

import loggingService from '../services/logging.service.js';

/**
 * Middleware to set logging context from HTTP request
 * This should be used after authentication middleware
 */
const setLoggingContext = (req, res, next) => {
    try {
        // Extract user information from request
        const user_id = req.user?.id || null;
        const ip_address = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || null;
        const user_agent = req.headers['user-agent'] || null;
        const session_id = req.session?.id || null;

        // Set context in logging service
        loggingService.setContext({
            user_id,
            ip_address,
            user_agent,
            session_id
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

