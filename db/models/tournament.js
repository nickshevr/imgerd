const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Tournament = sequelizeInstance.define('tournament', {
    deposit: Sequelize.INTEGER,
    status: Sequelize.ENUM('started', 'done')
});

module.exports = Tournament;