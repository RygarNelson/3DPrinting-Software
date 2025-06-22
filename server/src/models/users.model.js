'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "T_UTENTI",
    indexes: [
        {
            name: 'IX_T_UTENTI_EMAIL',
            unique: false,
            fields: ['email']
        },
        {
            name: 'IX_T_UTENTI_PASSWORD',
            unique: false,
            fields: ['password']
        }
    ],
    timestamps: true
});

export default User;