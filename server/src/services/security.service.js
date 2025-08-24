'use strict'

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

class SecurityService {
    constructor() {
        this.securityKeyPath = path.join(process.cwd(), 'log', 'security-key.txt');
        this.securityKey = null;
    }

    /**
     * Generate a random 30-character string
     * @returns {string} Random security key
     */
    generateSecurityKey() {
        return crypto.randomBytes(15).toString('hex').trim();
    }

    /**
     * Save the security key to file
     * @param {string} key - The security key to save
     */
    saveSecurityKey(key) {
        try {
            // Ensure the log directory exists
            const logDir = path.dirname(this.securityKeyPath);
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            // Write the security key to file
            fs.writeFileSync(this.securityKeyPath, key, 'utf8');
            console.log('Security key saved successfully');
        } catch (error) {
            console.error('Failed to save security key:', error);
            throw error;
        }
    }

    /**
     * Read the security key from file
     * @returns {string} The security key
     */
    readSecurityKey() {
        try {
            if (!fs.existsSync(this.securityKeyPath)) {
                throw new Error('Security key file not found');
            }
            return fs.readFileSync(this.securityKeyPath, 'utf8').trim();
        } catch (error) {
            console.error('Failed to read security key:', error);
            throw error;
        }
    }

    /**
     * Initialize the security key (generate new one and save to file)
     */
    initializeSecurityKey() {
        try {
            const newKey = this.generateSecurityKey();
            this.saveSecurityKey(newKey);
            this.securityKey = newKey;
            console.log('Security key initialized successfully');
        } catch (error) {
            console.error('Failed to initialize security key:', error);
            throw error;
        }
    }

    /**
     * Validate a provided security key against the stored one
     * @param {string} providedKey - The key to validate
     * @returns {boolean} True if valid, false otherwise
     */
    validateSecurityKey(providedKey) {
        try {
            if (!providedKey) {
                return false;
            }

            const storedKey = this.readSecurityKey();
            return providedKey === storedKey;
        } catch (error) {
            console.error('Failed to validate security key:', error);
            return false;
        }
    }
}

// Create and export a singleton instance
const securityService = new SecurityService();
export default securityService;
