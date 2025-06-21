'use strict'

import { sequelize } from './config/database.js';
import { checkDatabaseVersion, CURRENT_DATABASE_VERSION, getDatabaseVersion, setDatabaseVersion } from './methods/databaseVersionMethods.js';

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
        // Import models here to avoid circular dependency
        const { default: User } = await import('./models/users.model.js');
        const { default: DatabaseVersion } = await import('./models/databaseVersion.model.js');
        const authMethods = await import('./methods/authMethods.js');

        // Sync all models with database
        await sequelize.sync();
        console.log('Database synchronized successfully');

        // Check database version
        const dbVersion = await getDatabaseVersion(DatabaseVersion);
        
        if (dbVersion === null) {
            // First time database creation - set version and continue
            console.log('First time database creation detected. Setting version to:', CURRENT_DATABASE_VERSION);
            await setDatabaseVersion(DatabaseVersion, CURRENT_DATABASE_VERSION);
        } else {
            // Check version compatibility
            const isCompatible = checkDatabaseVersion(dbVersion);
            if (!isCompatible) {
                console.error('Database version incompatibility detected. Exiting application.');
                process.exit(1);
            }
            
            // If database version is lower, update it to current version
            if (dbVersion < CURRENT_DATABASE_VERSION) {
                // Do nothing, for now
            }
        }

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

export { connectToDatabase, initializeDatabase, sequelize };

