const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Player = sequelizeInstance.define('player', {
    username: {
        type: Sequelize.STRING,
        defaultValue: () => Date.now().toString(16)
    }
});

module.exports = Player;