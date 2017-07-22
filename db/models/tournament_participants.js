const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const TournamentParticipant = sequelizeInstance.define('tournament', {
    playerId: {
        type: Sequelize.INTEGER,
/*        references: {
            model: 'player',
            key: 'id',
        }*/
    },
    type: Sequelize.ENUM('player', 'backer'),
    backedId: Sequelize.INTEGER,
    deposit: Sequelize.INTEGER
});

module.exports = TournamentParticipant;