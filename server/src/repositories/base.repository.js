'use strict'

import loggingService from '../services/logging.service.js';

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
    async insertOne(data, additionalData = null) {
        try {
            const result = await this.model.create(data);
            
            // Log the insert operation
            await loggingService.logInsert(
                this.tableName,
                result.id,
                result.toJSON(),
                additionalData
            );

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
            // Get the old record before updating
            const oldRecord = await this.model.findByPk(id);
            if (!oldRecord) {
                throw new Error(`Record with ID ${id} not found in ${this.tableName}`);
            }

            const oldData = oldRecord.toJSON();

            // Perform the update
            const result = await this.model.update(data, {
                where: { id: id }
            });

            // Get the updated record
            const updatedRecord = await this.model.findByPk(id);
            const newData = updatedRecord.toJSON();

            // Log the update operation
            await loggingService.logUpdate(
                this.tableName,
                id,
                oldData,
                newData,
                additionalData
            );

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
            // Get the record before deleting
            const record = await this.model.findByPk(id);
            if (!record) {
                throw new Error(`Record with ID ${id} not found in ${this.tableName}`);
            }

            const recordData = record.toJSON();

            // Perform the delete
            const result = await this.model.destroy({
                where: { id: id }
            });

            // Log the delete operation
            if (this.model.options.paranoid) {
                // Soft delete
                await loggingService.logSoftDelete(
                    this.tableName,
                    id,
                    recordData,
                    additionalData
                );
            } else {
                // Hard delete
                await loggingService.logDelete(
                    this.tableName,
                    id,
                    recordData,
                    additionalData
                );
            }

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

            // Perform the restore
            const result = await this.model.restore({
                where: { id: id }
            });

            // Get the restored record
            const restoredRecord = await this.model.findByPk(id);
            const recordData = restoredRecord.toJSON();

            // Log the restore operation
            await loggingService.logRestore(
                this.tableName,
                id,
                recordData,
                additionalData
            );

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
                returning: true
            });

            // Log each insert operation
            const logPromises = results.map(result =>
                loggingService.logInsert(
                    this.tableName,
                    result.id,
                    result.toJSON(),
                    additionalData
                )
            );

            await Promise.all(logPromises);

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
            // Get the old records before updating
            const oldRecords = await this.model.findAll({ where });
            const oldDataMap = new Map(oldRecords.map(record => [record.id, record.toJSON()]));

            // Perform the bulk update
            const result = await this.model.update(data, { where });

            // Get the updated records
            const updatedRecords = await this.model.findAll({ where });
            const newDataMap = new Map(updatedRecords.map(record => [record.id, record.toJSON()]));

            // Log each update operation
            const logPromises = updatedRecords.map(record => {
                const oldData = oldDataMap.get(record.id);
                const newData = newDataMap.get(record.id);
                
                return loggingService.logUpdate(
                    this.tableName,
                    record.id,
                    oldData,
                    newData,
                    additionalData
                );
            });

            await Promise.all(logPromises);

            return result;
        } catch (error) {
            console.error(`Error bulk updating records in ${this.tableName}:`, error);
            throw error;
        }
    }
}

export default BaseRepository; 