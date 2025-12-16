'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Basetta from './basetta.model.js';
import Cliente from './cliente.model.js';
import ContoBancario from './conto-bancario.model.js';
import VenditaDettaglio from './venditaDettaglio.model.js';

const Vendita = sequelize.define('Vendita', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_vendita: {
        type: DataTypes.DATE,
        allowNull: true
    },
    data_scadenza: {
        type: DataTypes.DATE,
        allowNull: true
    },
    data_scadenza_spedizione: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'T_CLIENTI',
            key: 'id'
        }
    },
    totale_vendita: {
        type: DataTypes.DECIMAL(20,5),
        allowNull: true
    },
    stato_spedizione: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    link_tracciamento: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    conto_bancario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'T_CONTI_BANCARI',
            key: 'id'
        }
    },
    etichetta_spedizione: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: 'T_VENDITE',
    indexes: [
        {
            name: 'IX_T_VENDITE_DATA_VENDITA',
            unique: false,
            fields: ['data_vendita']
        },
        {
            name: 'IX_T_VENDITE_DATA_SCADENZA',
            unique: false,
            fields: ['data_scadenza']
        },
        {
            name: 'IX_T_VENDITE_DATA_SCADENZA_SPEDIZIONE',
            unique: false,
            fields: ['data_scadenza_spedizione']
        },
        {
            name: 'IX_T_VENDITE_CLIENTE_ID',
            unique: false,
            fields: ['cliente_id']
        },
        {
            name: 'IX_T_VENDITE_STATO_SPEDIZIONE',
            unique: false,
            fields: ['stato_spedizione']
        }
    ],
    timestamps: true,
    paranoid: true
});

Vendita.hasMany(VenditaDettaglio, {
    foreignKey: 'vendita_id',
    as: 'dettagli',
    onDelete: 'CASCADE',
    hooks: true
});
VenditaDettaglio.belongsTo(Vendita, {
    foreignKey: 'vendita_id',
    as: 'vendita'
});

Vendita.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    as: 'cliente'
});

Vendita.belongsTo(ContoBancario, {
    foreignKey: 'conto_bancario_id',
    as: 'conto_bancario'
});

Vendita.hasMany(Basetta, {
    foreignKey: 'vendita_id',
    as: 'basette',
    onDelete: 'CASCADE',
    hooks: true
});
Basetta.belongsTo(Vendita, {
    foreignKey: 'vendita_id',
    as: 'vendita'
});

export default Vendita; 