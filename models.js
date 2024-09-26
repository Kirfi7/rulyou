const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('GsFmaHhX', 'bsXdAH', 'YXARlmwhPyqtRdVB', {
    host: '185.177.216.77',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    efficiency: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = { User, sequelize };
