import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const DatabaseVersion = sequelize.define('DatabaseVersion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    tableName: "T_DATABASE_VERSION",
    timestamps: true
});

export default DatabaseVersion; 