const Sequelize = require('sequelize');
const sequelizeInstance = require('../adapter');

const Player = sequelizeInstance.define('player', {
    username: {
        type: Sequelize.STRING,
        defaultValue: () => Date.now().toString(16)
    },
    currentBalance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
});

Player.prototype.updateCurrentBalance = async function updateCurrentBalance(difference) {
    this.currentBalance += difference;

    await this.save();
};

Player.updatePlayerBalance = async (playerId, difference) => {
   await Player.increment({ currentBalance: difference }, { where: { id: playerId }});
};

//TODO нужно ли? Планировался полный пересчет и обновление
Player.recalculatePlayerBalance = async (playerId, currentBalance) => {
    try {
        await Player.update({ currentBalance }, { where: { id: playerId }});
    } catch(e) {
        console.log(e);
    }
};

module.exports = Player;