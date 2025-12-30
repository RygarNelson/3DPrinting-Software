'use strict'

import Log from '../models/log.model.js';

class LoggingService {
    constructor() {
        this.currentContext = {
            user: null,
            ip_address: null,
            user_agent: null,
            group_id: null
        };
    }

    /**
     * Set the current context for logging (user info, IP, etc.)
     * @param {Object} context - Context object with user_id, ip_address, user_agent, session_id
     */
    setContext(context) {
        this.currentContext = { ...this.currentContext, ...context };
        // Always set the group id as the current timestamp in milliseconds
        this.currentContext.group_id = Date.now();
    }

    /**
     * Clear the current context
     */
    clearContext() {
        this.currentContext = {
            user: null,
            ip_address: null,
            user_agent: null,
            group_id: null
        };
    }

    /**
     * Prepare a log object without saving it
     * @param {Object} options - Logging options
     * @returns {Object} - Prepared log data
     */
    prepareLogData(options) {
        const {
            table_name,
            record_id,
            operation,
            field_name = null,
            old_value = null,
            new_value = null,
            old_record = null,
            new_record = null,
            additional_data = null
        } = options;

        return {
            table_name,
            record_id,
            operation,
            field_name,
            old_value: old_value ? String(old_value) : null,
            new_value: new_value ? String(new_value) : null,
            old_record: old_record ? JSON.stringify(old_record) : null,
            new_record: new_record ? JSON.stringify(new_record) : null,
            user: this.currentContext.user,
            ip_address: this.currentContext.ip_address,
            user_agent: this.currentContext.user_agent,
            additional_data: additional_data ? JSON.stringify(additional_data) : null,
            group_id: this.currentContext.group_id
        };
    }

    /**
     * Log a database operation
     * @param {Object} options - Logging options
     * @returns {Promise<Log>} - Created log entry
     */
    async logOperation(options) {
        const { transaction = null } = options;
        try {
            const logData = this.prepareLogData(options);
            return await Log.create(logData, { transaction: transaction });
        } catch (error) {
            console.error('Error creating log entry:', error);
            // Don't throw error to avoid breaking the main operation
            return null;
        }
    }

    /**
     * Prepare INSERT log data
     */
    prepareInsertLog(table_name, record_id, new_record, additional_data = null) {
        return this.prepareLogData({
            table_name,
            record_id,
            operation: 'INSERT',
            new_record,
            additional_data
        });
    }

    /**
     * Log an INSERT operation
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
     * Prepare UPDATE log data entries
     * Returns an array of log objects (one per changed field)
     */
    prepareUpdateLogs(table_name, record_id, old_record, new_record, additional_data = null) {
        // Find changed fields
        const changedFields = this.getChangedFields(old_record, new_record);
        
        // Create individual log entries for each changed field
        return changedFields.map(field => 
            this.prepareLogData({
                table_name,
                record_id,
                operation: 'UPDATE',
                field_name: field.name,
                old_value: field.old_value,
                new_value: field.new_value,
                additional_data
            })
        );
    }

    /**
     * Log an UPDATE operation
     */
    async logUpdate(table_name, record_id, old_record, new_record, additional_data = null, transaction = null) {
        const logEntries = this.prepareUpdateLogs(table_name, record_id, old_record, new_record, additional_data);
        const logPromises = logEntries.map(logData => 
            Log.create(logData, { transaction })
        );
        return Promise.all(logPromises);
    }

    /**
     * Prepare DELETE log data
     */
    prepareDeleteLog(table_name, record_id, old_record, additional_data = null) {
        return this.prepareLogData({
            table_name,
            record_id,
            operation: 'DELETE',
            old_record,
            additional_data
        });
    }

    /**
     * Log a DELETE operation
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
     * Prepare SOFT_DELETE log data
     */
    prepareSoftDeleteLog(table_name, record_id, old_record, additional_data = null) {
        return this.prepareLogData({
            table_name,
            record_id,
            operation: 'SOFT_DELETE',
            old_record,
            additional_data
        });
    }

    /**
     * Log a SOFT_DELETE operation (paranoid delete)
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
     * Prepare RESTORE log data
     */
    prepareRestoreLog(table_name, record_id, new_record, additional_data = null) {
        return this.prepareLogData({
            table_name,
            record_id,
            operation: 'RESTORE',
            new_record,
            additional_data
        });
    }

    /**
     * Log a RESTORE operation (restore from soft delete)
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

            // Helper to check if a value is a valid date
            const isValidDate = (d) => {
                if (d instanceof Date && !isNaN(d)) return true;
                if (typeof d === 'string' || typeof d === 'number') {
                    const date = new Date(d);
                    return !isNaN(date.getTime());
                }
                return false;
            };

            // Check if both values are potentially dates
            if (isValidDate(oldValue) && isValidDate(newValue)) {
                // If they are both dates, compare their timestamps
                const oldDate = new Date(oldValue);
                const newDate = new Date(newValue);
                
                // Compare timestamps
                if (oldDate.getTime() !== newDate.getTime()) {
                    changedFields.push({
                        name: field,
                        old_value: oldValue,
                        new_value: newValue
                    });
                }
            }
            // Strict equality check for non-dates
            // Note: Use loose equality (!=) if typemismatch is expected but value is same (e.g. "1" and 1)
            // But strict (!==) is safer. Let's stick to loose (!=) as per previous implementation to avoid regression
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
     * @param {Object} user - User object
     * @param {Object} options - Query options (limit, offset, order)
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsForUser(user, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: { user },
            limit,
            offset,
            order
        });
    }
}

// Create a singleton instance
const loggingService = new LoggingService();

export default loggingService; 