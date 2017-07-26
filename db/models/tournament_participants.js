const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');
const Player = require('./player');
const Tournament = require('./tournament');

const TournamentParticipant = sequelizeInstance.define('tournamentParticipant', {
    type: Sequelize.ENUM('player', 'backer'),
    deposit: Sequelize.INTEGER
});
const Bakers = sequelizeInstance.define('bakers');

TournamentParticipant.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
TournamentParticipant.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournamentObject' });
TournamentParticipant.belongsToMany(Player, { foreignKey: 'backersIds', through: Bakers ,as: 'Backers' });

module.exports = TournamentParticipant;