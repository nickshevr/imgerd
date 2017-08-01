const qs = require('qs');

exports.createUserMap = async (agent, userMapArray) => {
    for (const userData of userMapArray) {
        const query = qs.stringify({ playerId: userData.id, points: userData.balance });
        await agent.get(`/fund?${query}`);
    }
};
