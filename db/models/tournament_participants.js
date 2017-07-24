const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');
const Player = require('./player');

const TournamentParticipant = sequelizeInstance.define('tournamentParticipant', {
    playerId: {
        type: Sequelize.INTEGER,
        references: {
            model: Player,
            key: 'id',
        }
    },
    type: Sequelize.ENUM('player', 'backer'),
    backedId: Sequelize.INTEGER,
    deposit: Sequelize.INTEGER
});

module.exports = TournamentParticipant;