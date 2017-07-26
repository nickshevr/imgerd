const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');
const Player = require('./player');
const Tournament = require('./tournament');

const TournamentParticipant = sequelizeInstance.define('tournamentParticipant', {
    /*playerId: {
        type: Sequelize.INTEGER,
        references: {
            model: Player,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    tournamentId: {
        type: Sequelize.INTEGER,
        references: {
            model: Tournament,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    backersIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        references: {
            model: Player,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },*/
    type: Sequelize.ENUM('player', 'backer'),
    deposit: Sequelize.INTEGER
});

TournamentParticipant.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
TournamentParticipant.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournamentObject' });
//TournamentParticipant.belongsToMany(Player, { foreignKey: 'backersIds', as: 'Backers' });

module.exports = TournamentParticipant;