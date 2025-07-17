'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ContoBancario = sequelize.define('ContoBancario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_proprietario: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    cognome_proprietario: {
        type: DataTypes.STRING(60),
        allowNull: true,
    },
    iban: {
        type: DataTypes.STRING(27),
        allowNull: true
    }
}, {
    tableName: "T_CONTI_BANCARI",
    indexes: [
        {
            name: 'IX_T_CONTI_BANCARI_NOME_PROPRIETARIO',
            unique: false,
            fields: ['nome_proprietario']
        },
        {
            name: 'IX_T_CONTI_BANCARI_COGNOME_PROPRIETARIO',
            unique: false,
            fields: ['cognome_proprietario']
        },
        {
            name: 'IX_T_CONTI_BANCARI_IBAN',
            unique: false,
            fields: ['iban']
        },
    ],
    timestamps: true,
    paranoid: true
});

export default ContoBancario;