'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    table_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Name of the table that was modified'
    },
    record_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the record that was modified'
    },
    operation: {
        type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE'),
        allowNull: false,
        comment: 'Type of operation performed'
    },
    field_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Name of the specific field that was changed (for UPDATE operations)'
    },
    old_value: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Previous value before the change'
    },
    new_value: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'New value after the change'
    },
    old_record: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Complete old record as JSON (for INSERT/DELETE operations)'
    },
    new_record: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Complete new record as JSON (for INSERT operations)'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the user who made the change'
    },
    ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address of the user who made the change'
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'User agent string'
    },
    session_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Session identifier'
    },
    additional_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional context data as JSON'
    }
}, {
    tableName: "T_LOGS",
    indexes: [
        {
            name: 'IX_T_LOGS_TABLE_NAME',
            fields: ['table_name']
        },
        {
            name: 'IX_T_LOGS_RECORD_ID',
            fields: ['record_id']
        },
        {
            name: 'IX_T_LOGS_OPERATION',
            fields: ['operation']
        },
        {
            name: 'IX_T_LOGS_CREATED_AT',
            fields: ['createdAt']
        },
        {
            name: 'IX_T_LOGS_USER_ID',
            fields: ['user_id']
        },
        {
            name: 'IX_T_LOGS_TABLE_RECORD',
            fields: ['table_name', 'record_id']
        }
    ],
    timestamps: true,
    paranoid: false // Logs should never be deleted
});

export default Log; 