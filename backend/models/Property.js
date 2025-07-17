const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  owner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gpsCoordinates: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  landTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'residential',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'active',
  },
});

module.exports = Property;