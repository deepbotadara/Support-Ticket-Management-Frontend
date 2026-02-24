const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define(
  'Role',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.ENUM('MANAGER', 'SUPPORT', 'USER'),
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: false, tableName: 'roles' }
);

module.exports = Role;
