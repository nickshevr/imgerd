const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const Player = require('db/models').Player;
const sequalizeInstace = require('db/adapter');
const { createUserMap } = require('../helpers/creator');

const userMap = [
    { id: 1, balance: 300 },
    { id: 2, balance: 300 },
    { id: 3, balance: 300 },
    { id: 4, balance: 500 },
    { id: 5, balance: 1000 }
];

const userMapAfter = [
    { id: 1, balance: 550 },
    { id: 2, balance: 550 },
    { id: 3, balance: 550 },
    { id: 4, balance: 750 },
    { id: 5, balance: 0 }
];

describe('From Test Task', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
        await createUserMap(user, userMap);
    });

    it('Should create tournament', async () => {
        const res = await user.get('/announceTournament?tournamentId=1&deposit=1000');

        console.log(res.body);
    });

    it('Should create tournamentParticipant', async () => {
        const res = await user.get('/joinTournament?tournamentId=1&playerId=5');

        console.log(res.body);
    });

    it('Should create another tournamentParticipant', async () => {
        const query = qs.stringify({ tournamentId: 1, playerId: 1, backerIds: [2, 3, 4] });
        const res = await user.get(`/joinTournament?${query}`);

        console.log(res.body);
    });

    it('Should resolve tournament && update players balances', async () => {
        const query = qs.stringify({ tournamentId: 1 });
        const res = await user.post(`/resultTournament?${query}`)
            .send({
                winners: [{
                    playerId: 1,
                    prize: 2000
                }]
            });

        console.log(res.body);

        for (const userObj of userMapAfter) {
            const userDB = await Player.findOne({ where: { id: userObj.id }});
            userDB.currentBalance.should.be.equal(userObj.balance);
        }
    });

});
