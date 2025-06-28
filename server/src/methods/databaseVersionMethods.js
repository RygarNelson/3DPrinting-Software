/**
 * Check and handle database version compatibility
 * @param {number} dbVersion - The version found in the database
 * @returns {boolean} - True if compatible, false if incompatible
 */
export const CURRENT_DATABASE_VERSION = 3;

export const checkDatabaseVersion = (dbVersion) => {
    console.log(`Database version: ${dbVersion}, Server expects version: ${CURRENT_DATABASE_VERSION}`);
    
    if (dbVersion === CURRENT_DATABASE_VERSION) {
        console.log('Database version matches server version. Proceeding normally.');
        return true;
    }
    
    if (dbVersion < CURRENT_DATABASE_VERSION) {
        console.log(`Database version (${dbVersion}) is lower than server version (${CURRENT_DATABASE_VERSION}). Logging and continuing...`);
        return true;
    }
    
    if (dbVersion > CURRENT_DATABASE_VERSION) {
        console.error(`CRITICAL: Database version (${dbVersion}) is higher than server version (${CURRENT_DATABASE_VERSION}).`);
        console.error('This server version is outdated and cannot work with this database.');
        console.error('Please update the server to a newer version or downgrade the database.');
        return false;
    }
    
    return true;
};

/**
 * Get the current database version from the database
 * @param {Object} DatabaseVersion - The DatabaseVersion model
 * @returns {number|null} - The version number or null if not found
 */
export const getDatabaseVersion = async (DatabaseVersion) => {
    try {
        const versionRecord = await DatabaseVersion.findOne({
            order: [['version', 'DESC']]
        });
        
        return versionRecord ? versionRecord.version : null;
    } catch (error) {
        console.error('Error getting database version:', error);
        return null;
    }
};

/**
 * Set the database version in the database
 * @param {Object} DatabaseVersion - The DatabaseVersion model
 * @param {number} version - The version to set
 */
export const setDatabaseVersion = async (DatabaseVersion, version) => {
    try {
        // Remove any existing version records
        await DatabaseVersion.destroy({ where: {} });
        
        // Create new version record
        await DatabaseVersion.create({ version });
        console.log(`Database version set to: ${version}`);
    } catch (error) {
        console.error('Error setting database version:', error);
        throw error;
    }
}; 