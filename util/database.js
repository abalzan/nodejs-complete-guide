const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs', 'nodejs', 'nodejs', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;