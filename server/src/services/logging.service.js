'use strict'

import Log from '../models/log.model.js';

class LoggingService {
    constructor() {
        this.currentContext = {
            user_id: null,
            ip_address: null,
            user_agent: null,
            session_id: null
        };
    }

    /**
     * Set the current context for logging (user info, IP, etc.)
     * @param {Object} context - Context object with user_id, ip_address, user_agent, session_id
     */
    setContext(context) {
        this.currentContext = { ...this.currentContext, ...context };
    }

    /**
     * Clear the current context
     */
    clearContext() {
        this.currentContext = {
            user_id: null,
            ip_address: null,
            user_agent: null,
            session_id: null
        };
    }

    /**
     * Log a database operation
     * @param {Object} options - Logging options
     * @returns {Promise<Log>} - Created log entry
     */
    async logOperation(options) {
        const {
            table_name,
            record_id,
            operation,
            field_name = null,
            old_value = null,
            new_value = null,
            old_record = null,
            new_record = null,
            additional_data = null,
            transaction = null
        } = options;

        try {
            const logData = {
                table_name,
                record_id,
                operation,
                field_name,
                old_value: old_value ? String(old_value) : null,
                new_value: new_value ? String(new_value) : null,
                old_record: old_record ? JSON.stringify(old_record) : null,
                new_record: new_record ? JSON.stringify(new_record) : null,
                user_id: this.currentContext.user_id,
                ip_address: this.currentContext.ip_address,
                user_agent: this.currentContext.user_agent,
                session_id: this.currentContext.session_id,
                additional_data: additional_data ? JSON.stringify(additional_data) : null
            };

            return await Log.create(logData, { transaction: transaction });
        } catch (error) {
            console.error('Error creating log entry:', error);
            // Don't throw error to avoid breaking the main operation
            return null;
        }
    }

    /**
     * Log an INSERT operation
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the inserted record
     * @param {Object} new_record - Complete new record data
     * @param {Object} additional_data - Additional context data
     * @returns {Promise<Log>} - Created log entry
     */
    async logInsert(table_name, record_id, new_record, additional_data = null, transaction = null) {
        return this.logOperation({
            table_name,
            record_id,
            operation: 'INSERT',
            new_record,
            additional_data,
            transaction
        });
    }

    /**
     * Log an UPDATE operation
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the updated record
     * @param {Object} old_record - Complete old record data
     * @param {Object} new_record - Complete new record data
     * @param {Object} additional_data - Additional context data
     * @returns {Promise<Log>} - Created log entry
     */
    async logUpdate(table_name, record_id, old_record, new_record, additional_data = null, transaction = null) {
        // Find changed fields
        const changedFields = this.getChangedFields(old_record, new_record);
        
        // Create individual log entries for each changed field
        const logPromises = changedFields.map(field => 
            this.logOperation({
                table_name,
                record_id,
                operation: 'UPDATE',
                field_name: field.name,
                old_value: field.old_value,
                new_value: field.new_value,
                additional_data,
                transaction
            })
        );

        return Promise.all(logPromises);
    }

    /**
     * Log a DELETE operation
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the deleted record
     * @param {Object} old_record - Complete old record data
     * @param {Object} additional_data - Additional context data
     * @returns {Promise<Log>} - Created log entry
     */
    async logDelete(table_name, record_id, old_record, additional_data = null, transaction = null) {
        return this.logOperation({
            table_name,
            record_id,
            operation: 'DELETE',
            old_record,
            additional_data,
            transaction
        });
    }

    /**
     * Log a SOFT_DELETE operation (paranoid delete)
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the soft-deleted record
     * @param {Object} old_record - Complete old record data
     * @param {Object} additional_data - Additional context data
     * @returns {Promise<Log>} - Created log entry
     */
    async logSoftDelete(table_name, record_id, old_record, additional_data = null, transaction = null) {
        return this.logOperation({
            table_name,
            record_id,
            operation: 'SOFT_DELETE',
            old_record,
            additional_data,
            transaction
        });
    }

    /**
     * Log a RESTORE operation (restore from soft delete)
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the restored record
     * @param {Object} new_record - Complete restored record data
     * @param {Object} additional_data - Additional context data
     * @returns {Promise<Log>} - Created log entry
     */
    async logRestore(table_name, record_id, new_record, additional_data = null, transaction = null) {
        return this.logOperation({
            table_name,
            record_id,
            operation: 'RESTORE',
            new_record,
            additional_data,
            transaction
        });
    }

    /**
     * Get changed fields between old and new records
     * @param {Object} old_record - Old record data
     * @param {Object} new_record - New record data
     * @returns {Array} - Array of changed fields with name, old_value, and new_value
     */
    getChangedFields(old_record, new_record) {
        const changedFields = [];
        const allFields = new Set([...Object.keys(old_record || {}), ...Object.keys(new_record || {})]);

        for (const field of allFields) {
            // Skip internal Sequelize fields
            if (['id', 'createdAt', 'updatedAt', 'deletedAt'].includes(field)) {
                continue;
            }

            const oldValue = old_record?.[field];
            const newValue = new_record?.[field];

            // Check if both values are dates
            if (oldValue instanceof Date && newValue instanceof Date) {
                if (oldValue.getTime() != newValue.getTime()) {
                    changedFields.push({
                        name: field,
                        old_value: oldValue,
                        new_value: newValue
                    });
                }
            }
            // Compare values (handling null/undefined)
            else if (oldValue != newValue) {
                changedFields.push({
                    name: field,
                    old_value: oldValue,
                    new_value: newValue
                });
            }
        }

        return changedFields;
    }

    /**
     * Get logs for a specific table and record
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the record
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsForRecord(table_name, record_id, options = {}) {
        const { limit = 50, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: {
                table_name,
                record_id
            },
            limit,
            offset,
            order
        });
    }

    /**
     * Get logs for a specific table
     * @param {string} table_name - Name of the table
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsForTable(table_name, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: { table_name },
            limit,
            offset,
            order
        });
    }

    /**
     * Get logs for a specific user
     * @param {number} user_id - ID of the user
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsForUser(user_id, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: { user_id },
            limit,
            offset,
            order
        });
    }
}

// Create a singleton instance
const loggingService = new LoggingService();

export default loggingService; 