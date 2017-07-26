const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');
const Player = require('./player');

const Balances = sequelizeInstance.define('balance', {
/*    playerId: {
        type: Sequelize.INTEGER,
        references: {
            model: Player,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },*/
    amount: Sequelize.INTEGER,
    reason: Sequelize.ENUM('api', 'tournament')
});

Balances.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });

module.exports = Balances;