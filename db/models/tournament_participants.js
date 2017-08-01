/*
const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');
const Player = sequelizeInstance.model('player');
const Tournament = sequelizeInstance.model('tournament');

const TournamentParticipant = sequelizeInstance.define('tournament_participant');
const Bakers = sequelizeInstance.define('bakers');

TournamentParticipant.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
TournamentParticipant.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournamentObject' });
TournamentParticipant.belongsToMany(Player, { foreignKey: 'backerIds', through: Bakers, as: 'Backers' });

module.exports = TournamentParticipant;*/
