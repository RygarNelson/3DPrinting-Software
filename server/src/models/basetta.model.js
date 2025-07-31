'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Basetta = sequelize.define('Basetta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vendita_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'T_VENDITE',
            key: 'id'
        }
    },
    dimensione: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    quantita: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    stato_stampa: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'T_BASETTE',
    indexes: [
        {
            name: 'IX_T_BASETTE_VENDITA_ID',
            unique: false,
            fields: ['vendita_id']
        },
        {
            name: 'IX_T_BASETTE_STATO_STAMPA',
            unique: false,
            fields: ['stato_stampa']
        }
    ],
    timestamps: true,
    paranoid: true
});

export default Basetta; 