
const { sequelize } = require('./connection');
const { DataTypes } = require('sequelize');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'autor',
  timestamps: true,
});

const Book = sequelize.define('Book', {
  // ... your Book model
});

module.exports = {
  sequelize,
  Author,
  Book,
};
