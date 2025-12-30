'use strict'

import { Op } from 'sequelize';
import Log from '../models/log.model.js';
import BaseRepository from './base.repository.js';

class LogRepository extends BaseRepository {
    constructor() {
        super(Log, 'T_LOGS');
    }

    /**
     * Get logs with advanced filtering
     * @param {Object} filters - Filter options
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Object with count and rows
     */
    async getLogsWithFilters(filters = {}, options = {}) {
        const {
            table_name,
            record_id,
            operation,
            user,
            date_from,
            date_to,
            group_id,
            limit = 100,
            offset = 0,
            order = [['createdAt', 'DESC']]
        } = options;

        const whereClause = {};

        if (filters.table_name) {
            if (filters.table_name === 'T_VENDITE' && filters.record_id) {
                whereClause[Op.or] = [
                    {
                        table_name: 'T_VENDITE',
                        record_id: filters.record_id
                    },
                    {
                        table_name: 'T_VENDITE_DETTAGLI',
                        additional_data: {
                            [Op.like]: `%"parent_vendita_id":${filters.record_id}%`
                        }
                    },
                    {
                        table_name: 'T_BASETTE',
                        additional_data: {
                            [Op.like]: `%"parent_vendita_id":${filters.record_id}%`
                        }
                    }
                ];
                // Since we handled table_name and record_id here, we don't add them individually
            } else {
                whereClause.table_name = filters.table_name;
                if (filters.record_id) {
                    whereClause.record_id = filters.record_id;
                }
            }
        } else if (filters.record_id) {
            whereClause.record_id = filters.record_id;
        }

        if (filters.operation) {
            whereClause.operation = filters.operation;
        }

        if (filters.group_id) {
            whereClause.group_id = filters.group_id;
        }

        if (filters.user) {
            whereClause.user = filters.user;
        }

        if (filters.date_from || filters.date_to) {
            whereClause.createdAt = {};
            if (filters.date_from) {
                whereClause.createdAt[Op.gte] = new Date(filters.date_from);
            }
            if (filters.date_to) {
                whereClause.createdAt[Op.lte] = new Date(filters.date_to);
            }
        }

        return Log.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order
        });
    }

    /**
     * Get logs for a specific table and record
     * @param {string} table_name - Name of the table
     * @param {number} record_id - ID of the record
     * @param {Object} options - Query options
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsForRecord(table_name, record_id, options = {}) {
        const { limit = 50, offset = 0, order = [['createdAt', 'DESC']] } = options;

        let whereClause = {
            table_name,
            record_id
        };

        // Special handling for T_VENDITE to include children logs
        if (table_name === 'T_VENDITE') {
            whereClause = {
                [Op.or]: [
                    {
                        table_name: 'T_VENDITE',
                        record_id: record_id
                    },
                    {
                        table_name: 'T_VENDITE_DETTAGLI',
                        additional_data: {
                            [Op.like]: `%"parent_vendita_id":${record_id}%`
                        }
                    },
                    {
                        table_name: 'T_BASETTE',
                        additional_data: {
                            [Op.like]: `%"parent_vendita_id":${record_id}%`
                        }
                    }
                ]
            };
        }
        
        return Log.findAll({
            where: whereClause,
            limit,
            offset,
            order
        });
    }

    /**
     * Get logs for a specific table
     * @param {string} table_name - Name of the table
     * @param {Object} options - Query options
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
     * @param {Object} options - Query options
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

    /**
     * Get logs for a specific operation type
     * @param {string} operation - Operation type
     * @param {Object} options - Query options
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsByOperation(operation, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: { operation },
            limit,
            offset,
            order
        });
    }

    /**
     * Get logs within a date range
     * @param {Date} dateFrom - Start date
     * @param {Date} dateTo - End date
     * @param {Object} options - Query options
     * @returns {Promise<Array>} - Array of log entries
     */
    async getLogsByDateRange(dateFrom, dateTo, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            limit,
            offset,
            order
        });
    }

    /**
     * Get recent logs (last N days)
     * @param {number} days - Number of days to look back
     * @param {Object} options - Query options
     * @returns {Promise<Array>} - Array of log entries
     */
    async getRecentLogs(days = 7, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);
        
        return Log.findAll({
            where: {
                createdAt: {
                    [Op.gte]: dateFrom
                }
            },
            limit,
            offset,
            order
        });
    }

    /**
     * Get logs with field changes (for UPDATE operations)
     * @param {string} table_name - Name of the table
     * @param {string} field_name - Name of the field
     * @param {Object} options - Query options
     * @returns {Promise<Array>} - Array of log entries
     */
    async getFieldChangeLogs(table_name, field_name, options = {}) {
        const { limit = 100, offset = 0, order = [['createdAt', 'DESC']] } = options;
        
        return Log.findAll({
            where: {
                table_name,
                field_name,
                operation: 'UPDATE'
            },
            limit,
            offset,
            order
        });
    }

    /**
     * Get statistics about logs
     * @param {Object} filters - Filter options
     * @returns {Promise<Object>} - Statistics object
     */
    async getLogStatistics(filters = {}) {
        const whereClause = {};

        if (filters.table_name) {
            whereClause.table_name = filters.table_name;
        }

        if (filters.user) {
            whereClause.user = filters.user;
        }

        if (filters.date_from || filters.date_to) {
            whereClause.createdAt = {};
            if (filters.date_from) {
                whereClause.createdAt[Op.gte] = new Date(filters.date_from);
            }
            if (filters.date_to) {
                whereClause.createdAt[Op.lte] = new Date(filters.date_to);
            }
        }

        const [totalLogs, operationStats, tableStats, userStats] = await Promise.all([
            Log.count({ where: whereClause }),
            Log.findAll({
                where: whereClause,
                attributes: [
                    'operation',
                    [Log.sequelize.fn('COUNT', '*'), 'count']
                ],
                group: ['operation']
            }),
            Log.findAll({
                where: whereClause,
                attributes: [
                    'table_name',
                    [Log.sequelize.fn('COUNT', '*'), 'count']
                ],
                group: ['table_name'],
                order: [[Log.sequelize.fn('COUNT', '*'), 'DESC']]
            }),
            Log.findAll({
                where: whereClause,
                attributes: [
                    'user',
                    [Log.sequelize.fn('COUNT', '*'), 'count']
                ],
                group: ['user'],
                order: [[Log.sequelize.fn('COUNT', '*'), 'DESC']]
            })
        ]);

        return {
            total_logs: totalLogs,
            operations: operationStats,
            tables: tableStats,
            users: userStats
        };
    }

    /**
     * Clean old logs (archive or delete)
     * @param {number} daysToKeep - Number of days to keep logs
     * @param {boolean} archive - Whether to archive instead of delete
     * @returns {Promise<number>} - Number of processed logs
     */
    async cleanOldLogs(daysToKeep = 365, archive = false) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const oldLogs = await Log.findAll({
            where: {
                createdAt: {
                    [Op.lt]: cutoffDate
                }
            }
        });

        if (archive) {
            // TODO: Implement archiving logic
            console.log(`Would archive ${oldLogs.length} logs older than ${cutoffDate}`);
            return oldLogs.length;
        } else {
            const deletedCount = await Log.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: cutoffDate
                    }
                }
            });
            return deletedCount;
        }
    }

    /**
     * Get enriched vendita logs with related dettagli and basette logs
     * @param {Object} filters - Filter options
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Object with count and enriched rows
     */
    async getEnrichedVenditaLogs(filters = {}, options = {}) {
        // First get the vendita logs
        const venditaLogs = await this.getLogsWithFilters(
            { ...filters, table_name: 'T_VENDITE' },
            options
        );

        // Get all vendita IDs to batch query related logs
        const groupIds = venditaLogs.rows.map(log => log.group_id);

        if (groupIds.length === 0) {
            return { count: 0, rows: [] };
        }

        // Batch query all related dettagli and basette logs
        const [allDettagliLogs, allBasettaLogs] = await Promise.all([
            Log.findAll({
                where: {
                    table_name: 'T_VENDITE_DETTAGLI',
                    group_id: {
                        [Op.in]: groupIds
                    }
                },
                order: [['createdAt', 'ASC']]
            }),
            Log.findAll({
                where: {
                    table_name: 'T_BASETTE',
                    group_id: {
                        [Op.in]: groupIds
                    }
                },
                order: [['createdAt', 'ASC']]
            })
        ]);

        // Group related logs by vendita_id for efficient lookup
        const dettagliLogsByVendita = {};
        const basettaLogsByVendita = {};

        // Group dettagli logs by vendita_id
        for (const log of allDettagliLogs) {
            // We need to get the vendita_id from the dettaglio record
            // Since we don't have direct access, we'll need to query it
            try {
                const dettaglioData = log.new_record ? JSON.parse(log.new_record) : 
                                    (log.old_record ? JSON.parse(log.old_record) : {});
                if (dettaglioData.vendita_id) {
                    if (!dettagliLogsByVendita[dettaglioData.vendita_id]) {
                        dettagliLogsByVendita[dettaglioData.vendita_id] = [];
                    }
                    dettagliLogsByVendita[dettaglioData.vendita_id].push(log);
                }
            } catch (error) {
                console.error('Error parsing dettaglio log data:', error);
            }
        }

        // Group basette logs by vendita_id
        for (const log of allBasettaLogs) {
            try {
                const basettaData = log.new_record ? JSON.parse(log.new_record) : 
                                  (log.old_record ? JSON.parse(log.old_record) : {});
                if (basettaData.vendita_id) {
                    if (!basettaLogsByVendita[basettaData.vendita_id]) {
                        basettaLogsByVendita[basettaData.vendita_id] = [];
                    }
                    basettaLogsByVendita[basettaData.vendita_id].push(log);
                }
            } catch (error) {
                console.error('Error parsing basetta log data:', error);
            }
        }

        // For each vendita log, enrich it with related dettagli and basette logs
        const enrichedLogs = venditaLogs.rows.map((venditaLog) => {
            let enrichedLog = { ...venditaLog.toJSON() };
            
            const dettagliLogs = dettagliLogsByVendita[venditaLog.record_id] || [];
            const basetteLogs = basettaLogsByVendita[venditaLog.record_id] || [];

            // Enrich old_record with dettagli and basette
            if (enrichedLog.old_record) {
                try {
                    const oldRecord = JSON.parse(enrichedLog.old_record);
                    enrichedLog.old_record = this.mergeRelatedLogs(oldRecord, dettagliLogs, basetteLogs, 'old');
                } catch (error) {
                    console.error('Error parsing old_record:', error);
                }
            }

            // Enrich new_record with dettagli and basette
            if (enrichedLog.new_record) {
                try {
                    const newRecord = JSON.parse(enrichedLog.new_record);
                    enrichedLog.new_record = this.mergeRelatedLogs(newRecord, dettagliLogs, basetteLogs, 'new');
                } catch (error) {
                    console.error('Error parsing new_record:', error);
                }
            }

            // Enrich old_value and new_value if they exist
            // We DO NOT enrich old_value/new_value because these are usually specific field values (strings/numbers)
            // and merging related full-record logs into them corrupts the data structure.
            // Only old_record and new_record (which are full snapshots) should be enriched.

            return enrichedLog;
        });

        return {
            count: venditaLogs.count,
            rows: enrichedLogs
        };
    }

    /**
     * Merge related dettagli and basette logs into a record
     * @param {Object} record - The main record to enrich
     * @param {Array} dettagliLogs - Array of dettagli logs
     * @param {Array} basetteLogs - Array of basette logs
     * @param {string} recordType - 'old' or 'new' to determine which value to use
     * @returns {Object} - Enriched record
     */
    mergeRelatedLogs(record, dettagliLogs, basetteLogs, recordType) {
        const enrichedRecord = { ...record };

        // Add dettagli logs
        if (dettagliLogs.length > 0) {
            enrichedRecord.dettagli = dettagliLogs.map((log, index) => {
                const dettaglioData = recordType === 'old' ? 
                    (log.old_record ? JSON.parse(log.old_record) : {}) :
                    (log.new_record ? JSON.parse(log.new_record) : {});
                
                // Create a clean dettaglio object with audit metadata
                const enrichedDettaglio = {
                    ...dettaglioData,
                    _audit: {
                        log_id: log.id,
                        operation: log.operation,
                        field_name: log.field_name,
                        old_value: log.old_value,
                        new_value: log.new_value,
                        created_at: log.createdAt,
                        user: log.user
                    }
                };

                // Remove audit metadata from the main data to keep it clean
                delete enrichedDettaglio._audit.log_id;
                
                return enrichedDettaglio;
            });
        }

        // Add basette logs
        if (basetteLogs.length > 0) {
            enrichedRecord.basette = basetteLogs.map((log, index) => {
                const basettaData = recordType === 'old' ? 
                    (log.old_record ? JSON.parse(log.old_record) : {}) :
                    (log.new_record ? JSON.parse(log.new_record) : {});
                
                // Create a clean basetta object with audit metadata
                const enrichedBasetta = {
                    ...basettaData,
                    _audit: {
                        log_id: log.id,
                        operation: log.operation,
                        field_name: log.field_name,
                        old_value: log.old_value,
                        new_value: log.new_value,
                        created_at: log.createdAt,
                        user: log.user
                    }
                };

                // Remove audit metadata from the main data to keep it clean
                delete enrichedBasetta._audit.log_id;
                
                return enrichedBasetta;
            });
        }

        return enrichedRecord;
    }
}

// Create a singleton instance
const logRepository = new LogRepository();

export default logRepository; 