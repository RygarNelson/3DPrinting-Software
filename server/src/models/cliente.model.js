'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Cliente = sequelize.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    cognome: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    ragione_sociale: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    etichetta: {
        type: DataTypes.STRING(121),
        allowNull: true
    }
}, {
    tableName: "T_CLIENTI",
    indexes: [
        {
            name: 'IX_T_CLIENTI_EMAIL',
            unique: false,
            fields: ['email']
        },
        {
            name: 'IX_T_CLIENTI_TELEFONO',
            unique: false,
            fields: ['telefono']
        },
        {
            name: 'IX_T_CLIENTI_ETICHETTA',
            unique: false,
            fields: ['etichetta']
        }
    ],
    timestamps: true,
    paranoid: true
});

export default Cliente; 