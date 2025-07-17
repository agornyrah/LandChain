const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fromUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Transaction;