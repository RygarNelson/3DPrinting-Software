'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Spesa = sequelize.define('Spesa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_spesa: {
        type: DataTypes.DATE,
        allowNull: true
    },
    totale_spesa: {
        type: DataTypes.DECIMAL(20,5),
        allowNull: true
    },
    descrizione: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    quantita: {
        type: DataTypes.DECIMAL(20,4),
        allowNull: true
    },
    tipo_spesa: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    unita_misura: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'T_SPESE',
    indexes: [
        {
            name: 'IX_T_SPESE_DATA_SPESA',
            unique: false,
            fields: ['data_spesa']
        }
    ],
    timestamps: true,
    paranoid: true
});

export default Spesa;