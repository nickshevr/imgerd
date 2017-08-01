const Sequelize = require('sequelize');
const sequelize = require('../adapter');
const Player = require('./player');
// Возможно расширить поле reason и хранить ещё id турнира, с котрого получены поинты

const Balances = sequelize.define('balance', {
    amount: Sequelize.INTEGER,
    reason: Sequelize.ENUM('api', 'tournament')
});

Balances.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });

Balances.calculatePlayerBalance = async playerId => {
    const { dataValues } = await Balances.find({
        attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'balance']
        ],
        where: {
            playerId: playerId
        }
    });

    return dataValues.balance || 0;
};

Balances.calculatePlayersBalances = async playerIds => {
    const result = await Balances.findAll({
        where: { playerId: { $in: playerIds }},
        group: ['balance.playerId'],
        attributes: [ 'playerId', [sequelize.fn('SUM', sequelize.col('amount')), 'balance'] ]
    });

    return result.map(res => res.dataValues);
};

Balances.updatePlayerBalance = async (playerId, amount, reason) => {
    await Balances.create({
        playerId,
        amount,
        reason
    });
};

module.exports = Balances;