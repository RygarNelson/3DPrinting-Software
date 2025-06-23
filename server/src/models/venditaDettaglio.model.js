'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const VenditaDettaglio = sequelize.define('VenditaDettaglio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vendita_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'T_VENDITA',
            key: 'id'
        }
    },
    modello_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'T_MODELLO',
            key: 'id'
        }
    },
    quantita: {
        type: DataTypes.DECIMAL(15,4),
        allowNull: true
    },
    prezzo: {
        type: DataTypes.DECIMAL(15,5),
        allowNull: true
    }
}, {
    tableName: 'T_VENDITA_DETTAGLIO',
    indexes: [
        {
            name: 'IX_T_VENDITA_DETTAGLIO_VENDITA_ID',
            unique: false,
            fields: ['vendita_id']
        },
        {
            name: 'IX_T_VENDITA_DETTAGLIO_MODELLO_ID',
            unique: false,
            fields: ['modello_id']
        }
    ],
    timestamps: true,
    paranoid: true
});

export default VenditaDettaglio; 