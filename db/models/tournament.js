const Sequelize = require('sequelize');
const createError = require('http-errors');
const sequelizeInstance = require('../adapter');
const Balance = sequelizeInstance.model('balance');
const Player = sequelizeInstance.model('player');

const Tournament = sequelizeInstance.define('tournament', {
    deposit: {
        type: Sequelize.INTEGER,
        validate: {
            min: 0
        }
    },
    status: {
        type: Sequelize.ENUM('opened', 'closed'),
        defaultValue: 'opened'
    }
});

const TournamentParticipant = sequelizeInstance.define('tournament_participant', {
    backerIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
});

TournamentParticipant.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
TournamentParticipant.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournamentObject' });

//const Bakers = sequelizeInstance.define('bakers');
//TournamentParticipant.belongsToMany(Player, { foreignKey: 'backerIds', through: Bakers, as: 'Backers' });

Tournament.prototype.joinTournament = async function joinTournament(mainPlayer, backerIds) {
    if (this.status !== 'opened') {
        throw new Error("U cant join closed tournaments");
    }

    const isAlreadyParticipant = await TournamentParticipant.findOne({
        where: {
            playerId: mainPlayer.id,
            tournamentId: this.id,
        }
    });

    if (isAlreadyParticipant) {
        throw new Error("U cant join same tournament 2nd time");
    }

    if (backerIds.length) {
        const balancesObj = await Balance.calculatePlayersBalances(backerIds);

        if (Object.keys(balancesObj).length < backerIds.length) {
            throw new Error("Wrong backersIds");
        }
        if (backerIds.includes(mainPlayer.id)) {
            throw new Error("U cant be a player and a backet at same time");
        }

        const pointRequirement = Math.ceil(this.deposit / (backerIds.length + 1));

        for (const backerId of backerIds) {
            if (balancesObj[backerId] < pointRequirement) {
                throw new Error(`Player with id: ${backerId} dont have enought`);
            }
        }

        if (mainPlayer.currentBalance < pointRequirement) {
            throw new Error(`Player with id: ${mainPlayer.id} dont have enought`);
        }

        // TODO обернуть в транзакцию постгресса и можно будет убрать лишние проверки при помощи валидации внутри базы
        // + обновить объекты в таблице игроков можно 1 запросом, это быстрее

        await mainPlayer.updateCurrentBalance(-pointRequirement);
        await Balance.updatePlayerBalance(mainPlayer.id, -pointRequirement, 'tournament');

        for (const playerId of backerIds) {
            await Player.updatePlayerBalance(playerId, -pointRequirement);
            await Balance.updatePlayerBalance(playerId, -pointRequirement, 'tournament');
        }

        await TournamentParticipant.create({
            playerId: mainPlayer.id,
            tournamentId: this.id,
            backerIds
        });

        return;
    }

    const pointRequirement = this.deposit;

    if (mainPlayer.currentBalance < pointRequirement) {
        throw new Error(`Player with id: ${mainPlayer.id} dont have enought`);
    }

    await mainPlayer.updateCurrentBalance(-pointRequirement);
    await Balance.updatePlayerBalance(mainPlayer.id, -pointRequirement, 'tournament');

    await TournamentParticipant.create({
        playerId: mainPlayer.id,
        tournamentId: this.id,
        backerIds: []
    });
};

Tournament.prototype.resolveTournament = async function resolveTournament(winners) {
    if (this.status === 'closed') {
        throw new Error("Already resolved");
    }

    this.status = 'closed';

    for (const winner of winners) {
        const participant = await TournamentParticipant.findOne({ where: { tournamentId: this.id, playerId: winner.playerId }});

        if (!participant) {
            throw new Error("Cant find participant");
        }

        const prize = participant.backerIds.length ? Math.floor(winner.prize/(participant.backerIds.length +1)) : winner.prize;

        //@TODO в транзакцию sequelize.tz(Promise.all())
        // + обновить объекты в таблице игроков можно 1 запросом, это быстрее
        for (const backerId of participant.backerIds) {
            await Player.updatePlayerBalance(backerId, prize);
            await Balance.updatePlayerBalance(backerId, prize, 'tournament');
        }

        await Player.updatePlayerBalance(winner.playerId, prize);
        await Balance.updatePlayerBalance(winner.playerId, prize, 'tournament');
    }
};
exports.Tournament = Tournament;
exports.TournamentParticipant = TournamentParticipant;