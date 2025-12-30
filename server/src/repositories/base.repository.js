'use strict'


/**
 * Base repository class with automatic logging
 * Extend this class to get automatic logging for all CRUD operations
 */
class BaseRepository {
    constructor(model, tableName) {
        this.model = model;
        this.tableName = tableName;
    }

    /**
     * Get all records
     * @param {Object} options - Sequelize options
     * @returns {Promise<Array>} - Array of records
     */
    async getAll(options = {}) {
        return this.model.findAll(options);
    }

    /**
     * Find records with pagination and filtering
     * @param {Object} searchExample - Search criteria
     * @param {number} limit - Number of records to return
     * @param {number} offset - Number of records to skip
     * @param {Array} order - Order criteria
     * @param {Array} projection - Fields to select
     * @returns {Promise<Object>} - Object with count and rows
     */
    async find(searchExample, limit, offset, order, projection) {
        return this.model.findAndCountAll({
            where: searchExample,
            limit: limit,
            offset: offset,
            order: order,
            attributes: projection,
            distinct: true
        });
    }

    /**
     * Find one record by ID
     * @param {number} id - Record ID
     * @param {Array} projection - Fields to select
     * @returns {Promise<Object>} - Record or null
     */
    async findOne(id, projection) {
        return this.model.findOne({
            where: { id: id },
            attributes: projection
        });
    }

    /**
     * Insert a new record with automatic logging
     * @param {Object} data - Record data
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<Object>} - Created record
     */
    /**
     * Insert a new record with automatic logging
     * @param {Object} data - Record data
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<Object>} - Created record
     */
    async insertOne(data, additionalData = null) {
        try {
            const result = await this.model.create(data, {
                auditAdditionalData: additionalData
            });
            
            return result;
        } catch (error) {
            console.error(`Error inserting record in ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Update a record with automatic logging
     * @param {number} id - Record ID
     * @param {Object} data - Update data
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<Array>} - Update result
     */
    async updateOne(id, data, additionalData = null) {
        try {
            // Check if record exists to preserve error behavior
            const oldRecord = await this.model.findByPk(id);
            if (!oldRecord) {
                throw new Error(`Record with ID ${id} not found in ${this.tableName}`);
            }

            // Perform the update with hooks enabled
            const result = await this.model.update(data, {
                where: { id: id },
                individualHooks: true,
                auditAdditionalData: additionalData
            });

            return result;
        } catch (error) {
            console.error(`Error updating record in ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Delete a record with automatic logging
     * @param {number} id - Record ID
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<number>} - Number of deleted records
     */
    async deleteOne(id, additionalData = null) {
        try {
            // Check if record exists
            const record = await this.model.findByPk(id);
            if (!record) {
                throw new Error(`Record with ID ${id} not found in ${this.tableName}`);
            }

            // Perform the delete with hooks enabled
            const result = await this.model.destroy({
                where: { id: id },
                individualHooks: true,
                auditAdditionalData: additionalData
            });

            return result;
        } catch (error) {
            console.error(`Error deleting record in ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Restore a soft-deleted record with automatic logging
     * @param {number} id - Record ID
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<number>} - Number of restored records
     */
    async restoreOne(id, additionalData = null) {
        try {
            if (!this.model.options.paranoid) {
                throw new Error(`Model ${this.tableName} does not support soft deletes`);
            }

            // Perform the restore with hooks enabled
            const result = await this.model.restore({
                where: { id: id },
                individualHooks: true,
                auditAdditionalData: additionalData
            });

            return result;
        } catch (error) {
            console.error(`Error restoring record in ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Bulk insert records with automatic logging
     * @param {Array} records - Array of record data
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<Array>} - Array of created records
     */
    async bulkInsert(records, additionalData = null) {
        try {
            const results = await this.model.bulkCreate(records, {
                returning: true,
                individualHooks: true,
                auditAdditionalData: additionalData
            });

            return results;
        } catch (error) {
            console.error(`Error bulk inserting records in ${this.tableName}:`, error);
            throw error;
        }
    }

    /**
     * Bulk update records with automatic logging
     * @param {Object} data - Update data
     * @param {Object} where - Where clause
     * @param {Object} additionalData - Additional context data for logging
     * @returns {Promise<Array>} - Update result
     */
    async bulkUpdate(data, where, additionalData = null) {
        try {
            // Perform the bulk update with hooks enabled
            const result = await this.model.update(data, { 
                where,
                individualHooks: true,
                auditAdditionalData: additionalData
            });

            return result;
        } catch (error) {
            console.error(`Error bulk updating records in ${this.tableName}:`, error);
            throw error;
        }
    }
}

export default BaseRepository; 