'use strict'

import { sequelize } from './config/database.js';
import { backupDatabase, checkDatabaseVersion, CURRENT_DATABASE_VERSION, getDatabaseVersion, setDatabaseVersion } from './methods/databaseVersionMethods.js';

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
        // Backup the database before initializing
        await backupDatabase();

        // Import models here to avoid circular dependency
        const { default: User } = await import('./models/users.model.js');
        const { default: DatabaseVersion } = await import('./models/databaseVersion.model.js');
        const authMethods = await import('./methods/authMethods.js');

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
                await updateDatabase(dbVersion, DatabaseVersion, CURRENT_DATABASE_VERSION);
            }
        }

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

const updateDatabase = async (dbVersion, DatabaseVersion, CURRENT_DATABASE_VERSION) => {
    try {
        let version = dbVersion;
        do {
            switch (version) {
                case 1: {
                    await updateDatabaseToVersion2();
                    break;
                }
                case 2: {
                    await updateDatabaseToVersion3();
                    break;
                }
                case 3: {
                    await updateDatabaseToVersion4();
                    break;
                }
                case 4: {
                    await updateDatabaseToVersion5();
                    break;
                }
                case 5: {
                    await updateDatabaseToVersion6();
                    break;
                }
                case 6: {
                    await updateDatabaseToVersion7();
                    break;
                }
                default: {
                    console.log('Update to version', (version + 1), 'not implemented');
                    process.exit(1);
                }
            }

            version++;
            await setDatabaseVersion(DatabaseVersion, version);
        } while (version < CURRENT_DATABASE_VERSION);
    } catch (error) {
        console.log('Cannot update database');
        process.exit(1);
    }
};

const updateDatabaseToVersion2 = async () => {
    try {
        console.log('Updating database to version 2');
        await sequelize.query('ALTER TABLE T_MODELLI ADD COLUMN tipo INTEGER DEFAULT 0');

        await sequelize.query('UPDATE T_MODELLI SET tipo = 0 WHERE nome like "%PLA%"');
        await sequelize.query('UPDATE T_MODELLI SET tipo = 1 WHERE nome like "%Resina%"');
    } catch (error) {
        console.log('Cannot update database to version 2');
        process.exit(1);
    }
}

const updateDatabaseToVersion3 = async () => {
    try {
        console.log('Updating database to version 3');

        await sequelize.query('UPDATE T_VENDITE_DETTAGLI SET prezzo = prezzo * quantita');
    } catch (error) {
        console.log('Cannot update database to version 3');
        process.exit(1);
    }
}

const updateDatabaseToVersion4 = async () => {
    try {
        console.log('Updating database to version 4');

        await sequelize.query('ALTER TABLE T_SPESE ADD COLUMN quantita DECIMAL(20,4) NULL');
        await sequelize.query('ALTER TABLE T_SPESE ADD COLUMN tipo_spesa INTEGER NULL');
        await sequelize.query('ALTER TABLE T_SPESE ADD COLUMN unita_misura INTEGER NULL');
    } catch (error) {
        console.log('Cannot update database to version 4');
        process.exit(1);
    }
}

const updateDatabaseToVersion5 = async () => {
    try {
        console.log('Updating database to version 5');

        await sequelize.query('UPDATE T_VENDITE_DETTAGLI SET stato_stampa = 7 WHERE stato_stampa = 2 or stato_stampa = 3');
    } catch (error) {
        console.log('Cannot update database to version 5');
        process.exit(1);
    }
}

const updateDatabaseToVersion6 = async () => {
    try {
        console.log('Updating database to version 6');

        await sequelize.query('ALTER TABLE T_VENDITE ADD COLUMN data_scadenza_spedizione DATE NULL');
    } catch (error) {
        console.log('Cannot update database to version 6');
        process.exit(1);
    }
}

const updateDatabaseToVersion7 = async () => {
    try {
        console.log('Updating database to version 7');

        // Create table T_CONTI_BANCARI
        // Check if table exists
        const tableExists = await sequelize.query('SELECT name FROM sqlite_master WHERE type="table" AND name="T_CONTI_BANCARI"');
        if (tableExists.length === 0) {
            console.log('Creating table T_CONTI_BANCARI');
            await sequelize.query('CREATE TABLE T_CONTI_BANCARI (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_proprietario VARCHAR(60) NULL, cognome_proprietario VARCHAR(60) NULL, iban VARCHAR(27) NULL)');
        }

        // Add column conto_bancario_id to table T_VENDITE
        // check if column exists
        const columnExists = await sequelize.query('SELECT name FROM sqlite_master WHERE type="table" AND name="T_VENDITE" AND sql LIKE "%conto_bancario_id%"');
        if (columnExists.length === 0) {
            console.log('Adding column conto_bancario_id to table T_VENDITE');
            await sequelize.query('ALTER TABLE T_VENDITE ADD COLUMN conto_bancario_id INTEGER NULL');
        }

        // Add foreign key conto_bancario_id to table T_VENDITE
        // check if foreign key exists
        const foreignKeyExists = await sequelize.query('SELECT name FROM sqlite_master WHERE type="table" AND name="T_VENDITE" AND sql LIKE "%fk_t_vendite_t_conti_bancari_id%"');
        if (foreignKeyExists.length === 0) {
            console.log('Adding foreign key fk_t_vendite_t_conti_bancari_id to table T_VENDITE');
            await sequelize.query('ALTER TABLE T_VENDITE ADD FOREIGN KEY (fk_t_vendite_t_conti_bancari_id) REFERENCES T_CONTI_BANCARI(id)');
        }
    } catch (error) {
        console.log('Cannot update database to version 7');
        console.error(error);
        process.exit(1);
    }
}

export { connectToDatabase, initializeDatabase, sequelize };

