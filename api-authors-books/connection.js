const { Sequelize } = require('sequelize');

const database = "test_books";
const username = "postgres";
const password = "hola";  
const host = "localhost";

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres', 
});

module.exports = {
  sequelize
}