'use strict'

import { sequelize } from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to the SQLite database');
    } catch (error) {
        console.log('Could not connect to the database. Exiting now...', error);
        process.exit();
    }
};

const initializeDatabase = async () => {
    try {
        // Import User model here to avoid circular dependency
        const { default: User } = await import('./models/users.model.js');
        const authMethods = await import('./methods/authMethods.js');

        // Sync all models with database
        await sequelize.sync();
        console.log('Database synchronized successfully');

        // Check if any users exist
        const userCount = await User.count();
        if (userCount === 0) {
            // Create default admin user
            await User.create({
                name: "Account",
                surname: "Amministratore",
                email: "account.amministratore@gmail.com",
                password: authMethods.default.encryptPassword("account.amministratore"),
                role: 1
            });
            console.log('Default admin user created successfully');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

export { sequelize, connectToDatabase, initializeDatabase };