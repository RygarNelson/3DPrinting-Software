'use strict'

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Modello from './modello.model.js';
import Stampante from './stampante.model.js';

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
            model: 'T_VENDITE',
            key: 'id'
        }
    },
    modello_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'T_MODELLI',
            key: 'id'
        }
    },
    stampante_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'T_STAMPANTI',
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
    },
    stato_stampa: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    descrizione: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    stampa_is_pezzo_singolo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    stampa_is_parziale: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    basetta_dimensione: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    basetta_quantita: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'T_VENDITE_DETTAGLI',
    indexes: [
        {
            name: 'IX_T_VENDITE_DETTAGLI_VENDITA_ID',
            unique: false,
            fields: ['vendita_id']
        },
        {
            name: 'IX_T_VENDITE_DETTAGLI_MODELLO_ID',
            unique: false,
            fields: ['modello_id']
        },
        {
            name: 'IX_T_VENDITE_DETTAGLI_STAMPANTE_ID',
            unique: false,
            fields: ['stampante_id']
        },
        {
            name: 'IX_T_VENDITE_DETTAGLI_STATO_STAMPA',
            unique: false,
            fields: ['stato_stampa']
        }
    ],
    timestamps: true,
    paranoid: true
});

VenditaDettaglio.belongsTo(Modello, {
    foreignKey: 'modello_id',
    as: 'modello'
});

VenditaDettaglio.belongsTo(Stampante, {
    foreignKey: 'stampante_id',
    as: 'stampante'
});

export default VenditaDettaglio; 