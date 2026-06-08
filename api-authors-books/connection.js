const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:hola@localhost:5432/test_books',
  {
    dialect: 'postgres',
    logging: false,
    // Add SSL config for Railway (Railway uses SSL by default)
    dialectOptions: {
      ssl: process.env.DATABASE_URL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log('✓ Database connected'))
  .catch(err => console.error('✗ Database connection failed:', err.message));

module.exports = {
  sequelize
};
