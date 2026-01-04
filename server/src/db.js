"use strict";

import { sequelize } from "./config/database.js";
import {
  backupDatabase,
  checkDatabaseVersion,
  CURRENT_DATABASE_VERSION,
  getDatabaseVersion,
  setDatabaseVersion,
} from "./methods/databaseVersionMethods.js";
import Log from "./models/log.model.js"; // Needed for saving logs directly if needed or via service
import loggingService from "./services/logging.service.js";

const setupSequelizeHooks = () => {
  const AUDIT_EXCLUDE_TABLES = ["T_LOGS"];

  sequelize.addHook("beforeCreate", (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;
    // Nothing to do before create, we need the ID which is generated after
  });

  sequelize.addHook("afterCreate", async (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;

    try {
      const additionalData = options.auditAdditionalData || null;
      const logData = loggingService.prepareInsertLog(
        instance.constructor.tableName,
        instance.id,
        instance.toJSON(),
        additionalData
      );

      await Log.create(logData, { transaction: options.transaction });
    } catch (error) {
      console.error("Audit Log Error (afterCreate):", error);
    }
  });

  sequelize.addHook("beforeUpdate", (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;

    try {
      const additionalData = options.auditAdditionalData || null;
      // Get old and new values
      // _previousDataValues contains the values before the update
      // dataValues contains the new values
      const oldRecord = instance._previousDataValues;
      const newRecord = instance.dataValues;

      const logEntries = loggingService.prepareUpdateLogs(
        instance.constructor.tableName,
        instance.id,
        oldRecord,
        newRecord,
        additionalData
      );

      options.auditLogs = logEntries;
    } catch (error) {
      console.error("Audit Log Error (beforeUpdate):", error);
    }
  });

  sequelize.addHook("afterUpdate", async (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;

    if (options.auditLogs && options.auditLogs.length > 0) {
      try {
        await Log.bulkCreate(options.auditLogs, {
          transaction: options.transaction,
        });
      } catch (error) {
        console.error("Audit Log Error (afterUpdate):", error);
      }
    }
  });

  sequelize.addHook("beforeDestroy", (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;

    try {
      const additionalData = options.auditAdditionalData || null;
      let logEntry;

      if (instance.constructor.options.paranoid && !options.force) {
        // Soft delete
        logEntry = loggingService.prepareSoftDeleteLog(
          instance.constructor.tableName,
          instance.id,
          instance.toJSON(),
          additionalData
        );
      } else {
        // Hard delete
        logEntry = loggingService.prepareDeleteLog(
          instance.constructor.tableName,
          instance.id,
          instance.toJSON(),
          additionalData
        );
      }

      options.auditLogs = [logEntry];
    } catch (error) {
      console.error("Audit Log Error (beforeDestroy):", error);
    }
  });

  sequelize.addHook("afterDestroy", async (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;

    if (options.auditLogs && options.auditLogs.length > 0) {
      try {
        await Log.bulkCreate(options.auditLogs, {
          transaction: options.transaction,
        });
      } catch (error) {
        console.error("Audit Log Error (afterDestroy):", error);
      }
    }
  });

  sequelize.addHook("afterRestore", async (instance, options) => {
    if (AUDIT_EXCLUDE_TABLES.includes(instance.constructor.tableName)) return;

    try {
      const additionalData = options.auditAdditionalData || null;
      const logData = loggingService.prepareRestoreLog(
        instance.constructor.tableName,
        instance.id,
        instance.toJSON(),
        additionalData
      );

      await Log.create(logData, { transaction: options.transaction });
    } catch (error) {
      console.error("Audit Log Error (afterRestore):", error);
    }
  });
};

// Initialize hooks immediately
setupSequelizeHooks();

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the SQLite database");
  } catch (error) {
    console.log("Could not connect to the database. Exiting now...", error);
    process.exit();
  }
};

const initializeDatabase = async () => {
  try {
    // Backup the database before initializing
    await backupDatabase();

    // Import models here to avoid circular dependency
    const { default: User } = await import("./models/users.model.js");
    const { default: DatabaseVersion } = await import(
      "./models/databaseVersion.model.js"
    );
    const authMethods = await import("./methods/authMethods.js");

    // Check database version
    const dbVersion = await getDatabaseVersion(DatabaseVersion);

    if (dbVersion === null) {
      // First time database creation - set version and continue
      console.log(
        "First time database creation detected. Setting version to:",
        CURRENT_DATABASE_VERSION
      );
      await setDatabaseVersion(DatabaseVersion, CURRENT_DATABASE_VERSION);
    } else {
      // Check version compatibility
      const isCompatible = checkDatabaseVersion(dbVersion);
      if (!isCompatible) {
        console.error(
          "Database version incompatibility detected. Exiting application."
        );
        process.exit(1);
      }

      // If database version is lower, update it to current version
      if (dbVersion < CURRENT_DATABASE_VERSION) {
        await updateDatabase(
          dbVersion,
          DatabaseVersion,
          CURRENT_DATABASE_VERSION
        );
      }
    }

    // Sync all models with database
    await sequelize.sync();
    console.log("Database synchronized successfully");

    // Check if any users exist
    const userCount = await User.count();
    if (userCount === 0) {
      // Create default admin user
      await User.create({
        name: "Account",
        surname: "Amministratore",
        email: "account.amministratore@gmail.com",
        password: authMethods.default.encryptPassword("account.amministratore"),
        role: 1,
      });
      console.log("Default admin user created successfully");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

const updateDatabase = async (
  dbVersion,
  DatabaseVersion,
  CURRENT_DATABASE_VERSION
) => {
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
        case 7: {
          await updateDatabaseToVersion8();
          break;
        }
        case 8: {
          await updateDatabaseToVersion9();
          break;
        }
        case 9: {
          await updateDatabaseToVersion10();
          break;
        }
        case 10: {
          await updateDatabaseToVersion11();
          break;
        }
        case 11: {
          await updateDatabaseToVersion12();
          break;
        }
        case 12: {
          await updateDatabaseToVersion13();
          break;
        }
        case 13: {
          await updateDatabaseToVersion14();
          break;
        }
        case 14: {
          await updateDatabaseToVersion15();
          break;
        }
        case 15: {
          await updateDatabaseToVersion16();
          break;
        }
        case 16: {
          await updateDatabaseToVersion17();
          break;
        }
        case 17: {
          await updateDatabaseToVersion18();
          break;
        }
        default: {
          console.log("Update to version", version + 1, "not implemented");
          process.exit(1);
        }
      }

      version++;
      await setDatabaseVersion(DatabaseVersion, version);
    } while (version < CURRENT_DATABASE_VERSION);
  } catch (error) {
    console.log("Cannot update database");
    process.exit(1);
  }
};

const updateDatabaseToVersion2 = async () => {
  try {
    console.log("Updating database to version 2");
    await sequelize.query(
      "ALTER TABLE T_MODELLI ADD COLUMN tipo INTEGER DEFAULT 0"
    );

    await sequelize.query(
      'UPDATE T_MODELLI SET tipo = 0 WHERE nome like "%PLA%"'
    );
    await sequelize.query(
      'UPDATE T_MODELLI SET tipo = 1 WHERE nome like "%Resina%"'
    );
  } catch (error) {
    console.log("Cannot update database to version 2");
    process.exit(1);
  }
};

const updateDatabaseToVersion3 = async () => {
  try {
    console.log("Updating database to version 3");

    await sequelize.query(
      "UPDATE T_VENDITE_DETTAGLI SET prezzo = prezzo * quantita"
    );
  } catch (error) {
    console.log("Cannot update database to version 3");
    process.exit(1);
  }
};

const updateDatabaseToVersion4 = async () => {
  try {
    console.log("Updating database to version 4");

    await sequelize.query(
      "ALTER TABLE T_SPESE ADD COLUMN quantita DECIMAL(20,4) NULL"
    );
    await sequelize.query(
      "ALTER TABLE T_SPESE ADD COLUMN tipo_spesa INTEGER NULL"
    );
    await sequelize.query(
      "ALTER TABLE T_SPESE ADD COLUMN unita_misura INTEGER NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 4");
    process.exit(1);
  }
};

const updateDatabaseToVersion5 = async () => {
  try {
    console.log("Updating database to version 5");

    await sequelize.query(
      "UPDATE T_VENDITE_DETTAGLI SET stato_stampa = 7 WHERE stato_stampa = 2 or stato_stampa = 3"
    );
  } catch (error) {
    console.log("Cannot update database to version 5");
    process.exit(1);
  }
};

const updateDatabaseToVersion6 = async () => {
  try {
    console.log("Updating database to version 6");

    await sequelize.query(
      "ALTER TABLE T_VENDITE ADD COLUMN data_scadenza_spedizione DATE NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 6");
    process.exit(1);
  }
};

const updateDatabaseToVersion7 = async () => {
  try {
    console.log("Updating database to version 7");

    // Create table T_CONTI_BANCARI
    await sequelize.query(
      "CREATE TABLE T_CONTI_BANCARI (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_proprietario VARCHAR(60) NULL, cognome_proprietario VARCHAR(60) NULL, iban VARCHAR(27) NULL, createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL, deletedAt DATETIME NULL)"
    );

    // Add column conto_bancario_id to table T_VENDITE
    await sequelize.query(
      "ALTER TABLE T_VENDITE ADD COLUMN conto_bancario_id INTEGER NULL"
    );

    // Note: SQLite doesn't support adding foreign key constraints via ALTER TABLE
    // The foreign key relationship will be handled by Sequelize model associations
    // and enforced at the application level
    console.log(
      "Foreign key constraint will be handled by Sequelize model associations"
    );
  } catch (error) {
    console.log("Cannot update database to version 7");
    console.error(error);
    process.exit(1);
  }
};

const updateDatabaseToVersion8 = async () => {
  try {
    console.log("Updating database to version 8");

    await sequelize.query(
      "ALTER TABLE T_VENDITE_DETTAGLI ADD COLUMN descrizione VARCHAR(500) NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 8");
  }
};

const updateDatabaseToVersion9 = async () => {
  try {
    console.log("Updating database to version 9");

    await sequelize.query(
      "ALTER TABLE T_MODELLI ADD COLUMN basetta_dimensione VARCHAR(500) NULL"
    );
    await sequelize.query(
      "ALTER TABLE T_MODELLI ADD COLUMN basetta_quantita INTEGER NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 9");
  }
};

const updateDatabaseToVersion10 = async () => {
  try {
    console.log("Updating database to version 10");

    await sequelize.query(
      "ALTER TABLE T_MODELLI ADD COLUMN vinted_vendibile BOOLEAN NOT NULL DEFAULT FALSE"
    );
    await sequelize.query(
      "ALTER TABLE T_MODELLI ADD COLUMN vinted_is_in_vendita BOOLEAN NOT NULL DEFAULT FALSE"
    );
  } catch (error) {
    console.log("Cannot update database to version 10");
  }
};

const updateDatabaseToVersion11 = async () => {
  try {
    console.log("Updating database to version 11");

    await sequelize.query(
      "ALTER TABLE T_VENDITE_DETTAGLI ADD COLUMN stampa_is_pezzo_singolo BOOLEAN NOT NULL DEFAULT FALSE"
    );
    await sequelize.query(
      "ALTER TABLE T_VENDITE_DETTAGLI ADD COLUMN stampa_is_parziale BOOLEAN NOT NULL DEFAULT FALSE"
    );
  } catch (error) {
    console.log("Cannot update database to version 11");
  }
};

const updateDatabaseToVersion12 = async () => {
  try {
    console.log("Updating database to version 12");

    // Create table T_BASETTE
    await sequelize.query(
      "CREATE TABLE T_BASETTE (id INTEGER PRIMARY KEY AUTOINCREMENT, vendita_id INTEGER NOT NULL, dimensione VARCHAR(500) NULL, quantita INTEGER NULL, stato_stampa INTEGER NULL, createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL, deletedAt DATETIME NULL)"
    );

    // Note: SQLite doesn't support adding foreign key constraints via ALTER TABLE
    // The foreign key relationship will be handled by Sequelize model associations
    // and enforced at the application level
    console.log(
      "Foreign key constraint will be handled by Sequelize model associations"
    );
  } catch (error) {
    console.log("Cannot update database to version 12");
    console.error(error);
    process.exit(1);
  }
};

const updateDatabaseToVersion13 = async () => {
  try {
    console.log("Updating database to version 13");

    await sequelize.query(
      "ALTER TABLE T_VENDITE_DETTAGLI ADD COLUMN basetta_dimensione VARCHAR(500) NULL"
    );
    await sequelize.query(
      "ALTER TABLE T_VENDITE_DETTAGLI ADD COLUMN basetta_quantita INTEGER NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 13");
  }
};

const updateDatabaseToVersion14 = async () => {
  try {
    console.log("Updating database to version 14");

    // Create table T_LOGS for database change logging
    await sequelize.query(`CREATE TABLE T_LOGS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            table_name VARCHAR(100) NOT NULL,
            record_id INTEGER NULL,
            operation VARCHAR(20) NOT NULL,
            field_name VARCHAR(100) NULL,
            old_value TEXT NULL,
            new_value TEXT NULL,
            old_record TEXT NULL,
            new_record TEXT NULL,
            user_id INTEGER NULL,
            ip_address VARCHAR(45) NULL,
            user_agent TEXT NULL,
            session_id VARCHAR(255) NULL,
            additional_data TEXT NULL,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME NOT NULL
        )`);

    console.log("T_LOGS table created successfully");
  } catch (error) {
    console.log("Cannot update database to version 14");
    console.error(error);
    process.exit(1);
  }
};

const updateDatabaseToVersion15 = async () => {
  try {
    console.log("Updating database to version 15");

    await sequelize.query(
      "ALTER TABLE T_LOGS ADD COLUMN group_id INTEGER NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 15");
  }
};

const updateDatabaseToVersion16 = async () => {
  try {
    console.log("Updating database to version 16");

    await sequelize.query("ALTER TABLE T_LOGS ADD COLUMN user JSON NULL");
    await sequelize.query("ALTER TABLE T_LOGS DROP COLUMN user_id");
    await sequelize.query("ALTER TABLE T_LOGS DROP COLUMN session_id");
  } catch (error) {
    console.log("Cannot update database to version 16");
  }
};

const updateDatabaseToVersion17 = async () => {
  try {
    console.log("Updating database to version 17");

    await sequelize.query(
      "ALTER TABLE T_VENDITE ADD COLUMN etichetta_spedizione VARCHAR(500) NULL"
    );
  } catch (error) {
    console.log("Cannot update database to version 17");
  }
};

const updateDatabaseToVersion18 = async () => {
  try {
    console.log("Updating database to version 18");

    // Every vendita dettaglio and basetta that has value of 6 now needs to be updated to 7
    await sequelize.query(
      "UPDATE T_VENDITE_DETTAGLI SET stato_stampa = 7 WHERE stato_stampa = 6"
    );
    await sequelize.query(
      "UPDATE T_BASETTE SET stato_stampa = 7 WHERE stato_stampa = 6"
    );
  } catch (error) {
    console.log("Cannot update database to version 18");
  }
};

export { connectToDatabase, initializeDatabase, sequelize };
