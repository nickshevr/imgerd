const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Balances = sequelizeInstance.define('balance', {
    playerId: Sequelize.INTEGER,
    amount: Sequelize.INTEGER,
    reason: Sequelize.ENUM('api', 'tournament'),
});

module.exports = Balances;