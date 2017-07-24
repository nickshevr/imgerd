const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Tournament = sequelizeInstance.define('tournament', {
    deposit: Sequelize.INTEGER,
    status: Sequelize.ENUM('opened', 'closed')
});

module.exports = Tournament;