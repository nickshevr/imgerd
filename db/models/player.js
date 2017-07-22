const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Player = sequelizeInstance.define('player', {
    username: Sequelize.STRING
});

module.exports = Player;