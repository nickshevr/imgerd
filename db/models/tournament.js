const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Tournament = sequelizeInstance.define('tournament', {
    deposit: {
        type: Sequelize.INTEGER,
    },
    status: {
        type: Sequelize.ENUM('opened', 'closed'),
        defaultValue: 'opened'
    }
});

module.exports = Tournament;