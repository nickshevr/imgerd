const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);

describe('#{GET} /joinTournament', () => {
    before(async function() {
        //await user.get('/reset');
    });

    it(`Should return error query without playerId`, async () => {
        await user.get('/fund?playerId=1&points=300');
        await user.get('/announceTournament?tournamentId=1&deposit=300');

        const query = qs.stringify({ tournamentId: 'sdf', playerId: 1, point: 300, backerIds: [2, 3] });
        const res = await user.get(`/joinTournament?${query}`);

        console.log(res.body);
    });

});
