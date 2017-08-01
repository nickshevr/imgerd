const Sequelize = require('sequelize');
const createError = require('http-errors');
const sequelizeInstance = require('../adapter');
const Balance = require('./balances');

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

Tournament.prototype.joinTournament = async function joinTournament(mainPlayer, backerIds) {
    // TODO чекать мб уже участвует в этом турнире, тогда запрещать
    if (backerIds.length) {
        const balancesObj = await Balance.calculatePlayersBalances(backerIds);

        if (Object.keys(balancesObj).length < backerIds.length) {
            throw Error("Wrong backersIds");
        }
        if (backerIds.includes(mainPlayer.id)) {
            throw Error("U cant be a player and a backet at same time");
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

        // TODO обернуть в транзакцию постгресса

        await mainPlayer.updateCurrentBalance(-pointRequirement);
        await Balance.updatePlayerBalance(mainPlayer.id, -pointRequirement, 'tournament');

        for (const playerId of backerIds) {
            await Player.updatePlayerBalance(playerId, -pointRequirement);
            await Balance.updatePlayerBalance(playerId, -pointRequirement, 'tournament');
        }

        return;
    }

    const pointRequirement = this.deposit;

    if (mainPlayer.currentBalance < pointRequirement) {
        throw new Error(`Player with id: ${mainPlayer.id} dont have enought`);
    }

    await mainPlayer.updateCurrentBalance(-pointRequirement);
    await Balance.updatePlayerBalance(mainPlayer.id, -pointRequirement, 'tournament');
};

module.exports = Tournament;