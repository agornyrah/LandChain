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
});

module.exports = Property;