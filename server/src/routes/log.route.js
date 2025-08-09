'use strict'

import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import logRepository from '../repositories/log.repository.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Apply authentication to all log routes
router.use(authenticate);

/**
 * POST /api/logs
 * Get logs with filtering and pagination
 */
router.post('/', asyncHandler(async (req, res) => {
    const {
        table_name,
        record_id,
        operation,
        user_id,
        date_from,
        date_to,
        limit = 100,
        offset = 0,
        order = 'DESC'
    } = req.body;

    const filters = {
        table_name,
        record_id: record_id ? parseInt(record_id) : null,
        operation,
        user_id: user_id ? parseInt(user_id) : null,
        date_from,
        date_to
    };

    const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', order.toUpperCase()]]
    };

    // Remove null filters
    Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined) {
            delete filters[key];
        }
    });

    const result = await logRepository.getLogsWithFilters(filters, options);
    
    res.json({
        success: true,
        data: result.rows,
        pagination: {
            total: result.count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(result.count / parseInt(limit))
        }
    });
}));

/**
 * GET /api/logs/statistics
 * Get log statistics
 */
router.get('/statistics', asyncHandler(async (req, res) => {
    const {
        table_name,
        user_id,
        date_from,
        date_to
    } = req.query;

    const filters = {
        table_name,
        user_id: user_id ? parseInt(user_id) : null,
        date_from,
        date_to
    };

    // Remove null filters
    Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined) {
            delete filters[key];
        }
    });

    const statistics = await logRepository.getLogStatistics(filters);
    
    res.json({
        success: true,
        data: statistics
    });
}));

/**
 * GET /api/logs/recent
 * Get recent logs (last N days)
 */
router.get('/recent', asyncHandler(async (req, res) => {
    const {
        days = 7,
        limit = 50,
        offset = 0
    } = req.query;

    const logs = await logRepository.getRecentLogs(parseInt(days), {
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
    
    res.json({
        success: true,
        data: logs
    });
}));

/**
 * GET /api/logs/table/:tableName
 * Get logs for a specific table
 */
router.get('/table/:tableName', asyncHandler(async (req, res) => {
    const { tableName } = req.params;
    const {
        limit = 100,
        offset = 0,
        order = 'DESC'
    } = req.query;

    const logs = await logRepository.getLogsForTable(tableName, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', order.toUpperCase()]]
    });
    
    res.json({
        success: true,
        data: logs
    });
}));

/**
 * GET /api/logs/record/:tableName/:recordId
 * Get logs for a specific record
 */
router.get('/record/:tableName/:recordId', asyncHandler(async (req, res) => {
    const { tableName, recordId } = req.params;
    const {
        limit = 50,
        offset = 0,
        order = 'DESC'
    } = req.query;

    const logs = await logRepository.getLogsForRecord(tableName, parseInt(recordId), {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', order.toUpperCase()]]
    });
    
    res.json({
        success: true,
        data: logs
    });
}));

/**
 * GET /api/logs/operation/:operation
 * Get logs for a specific operation type
 */
router.get('/operation/:operation', asyncHandler(async (req, res) => {
    const { operation } = req.params;
    const {
        limit = 100,
        offset = 0,
        order = 'DESC'
    } = req.query;

    const logs = await logRepository.getLogsByOperation(operation, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', order.toUpperCase()]]
    });
    
    res.json({
        success: true,
        data: logs
    });
}));

/**
 * GET /api/logs/field-changes/:tableName/:fieldName
 * Get logs for field changes in a specific table
 */
router.get('/field-changes/:tableName/:fieldName', asyncHandler(async (req, res) => {
    const { tableName, fieldName } = req.params;
    const {
        limit = 100,
        offset = 0,
        order = 'DESC'
    } = req.query;

    const logs = await logRepository.getFieldChangeLogs(tableName, fieldName, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', order.toUpperCase()]]
    });
    
    res.json({
        success: true,
        data: logs
    });
}));

/**
 * POST /api/logs/clean
 * Clean old logs (admin only)
 */
router.post('/clean', asyncHandler(async (req, res) => {
    const {
        days_to_keep = 365,
        archive = false
    } = req.body;

    // Check if user has admin privileges
    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    const deletedCount = await logRepository.cleanOldLogs(parseInt(days_to_keep), archive);
    
    res.json({
        success: true,
        message: `Successfully processed ${deletedCount} old log entries`,
        data: {
            processed_count: deletedCount,
            days_kept: parseInt(days_to_keep),
            archived: archive
        }
    });
}));

/**
 * GET /api/logs/:id
 * Get a specific log entry by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const log = await logRepository.findOne(parseInt(id));
    
    if (!log) {
        return res.status(404).json({
            success: false,
            message: 'Log entry not found'
        });
    }
    
    res.json({
        success: true,
        data: log
    });
}));

export default router; 