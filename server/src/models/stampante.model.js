'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Stampante = sequelize.define('Stampante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true,
        index: true
    },
    descrizione: {
        type: DataTypes.STRING(500),
        allowNull: true,
        index: true
    }
}, {
    tableName: "T_STAMPANTI",
    indexes: [
        {
            name: 'IX_T_STAMPANTI_NOME',
            unique: false,
            fields: ['nome']
        },
        {
            name: 'IX_T_STAMPANTI_DESCRIZIONE',
            unique: false,
            fields: ['descrizione']
        }
    ],
    timestamps: true,
    paranoid: true
});

export default Stampante;