'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Modello = sequelize.define('Modello', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descrizione: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: "T_MODELLI",
    indexes: [
        {
            name: 'IX_T_MODELLI_NOME',
            unique: false,
            fields: ['nome']
        },
        {
            name: 'IX_T_MODELLI_DESCRIZIONE',
            unique: false,
            fields: ['descrizione']
        },
        {
            name: 'IX_T_MODELLI_TIPO',
            unique: false,
            fields: ['tipo']
        },
        {
            name: 'IX_T_MODELLI_UPDATED_AT',
            unique: false,
            fields: ['updatedAt']
        }
    ],
    timestamps: true,
    paranoid: true
});

export default Modello;