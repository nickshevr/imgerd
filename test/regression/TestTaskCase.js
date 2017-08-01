const request = require('supertest');
const app = require('api/app');
const qs = require('qs');
const user = request.agent(app);
const Player = require('db/models').Player;
const Tournament = require('db/models').Tournament;
const TournamentParticipant = require('db/models').TournamentParticipant;
const Balance = require('db/models').Balance;

const sequalizeInstace = require('db/adapter');
const { createUserMap } = require('../helpers/creator');

const TOURNAMENT_DEPOSITE = 1000;

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
        const res = await user.get(`/announceTournament?tournamentId=1&deposit=${TOURNAMENT_DEPOSITE}`);

        res.status.should.be.equal(200);

        const newTournamentDB = await Tournament.findOne({ where: { id: 1 }});
        newTournamentDB.deposit.should.be.equal(1000);
    });

    it('Should create tournamentParticipant for player 5', async () => {
        const res = await user.get('/joinTournament?tournamentId=1&playerId=5');

        res.status.should.be.equal(200);

        const newTournamentParticipant = await TournamentParticipant.findOne({ where: { playerId: 5 }});
        newTournamentParticipant.backerIds.length.should.be.equal(0);
        newTournamentParticipant.playerId.should.be.equal(5);
        newTournamentParticipant.tournamentId.should.be.equal(1);
    });

    it('Should degree player 5 balance', async () => {
        const updatedPlayer = await Player.findOne({ where: { id: 5 }});

        updatedPlayer.currentBalance.should.be.equal(userMap[4].balance - TOURNAMENT_DEPOSITE);
    });

    it('Should create another tournamentParticipant', async () => {
        const query = qs.stringify({ tournamentId: 1, playerId: 1, backerIds: [2, 3, 4] });
        const res = await user.get(`/joinTournament?${query}`);

        res.status.should.be.equal(200);

        const newTournamentParticipant = await TournamentParticipant.findOne({ where: { playerId: 1 }});
        newTournamentParticipant.backerIds.length.should.be.equal(3);
        newTournamentParticipant.playerId.should.be.equal(1);
        newTournamentParticipant.tournamentId.should.be.equal(1);
    });

    it('Should degree players balance', async () => {
        const updatedPlayers = await Player.findAll({ where: { id: { $in: [1, 2, 3, 4]} }});

        for (let i = 0; i < 4; i++) {
            updatedPlayers[i].currentBalance.should.be.equal(userMap[i].balance - TOURNAMENT_DEPOSITE/4);
        }
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


        res.status.should.be.equal(200);

        for (const userObj of userMapAfter) {
            const userDB = await Player.findOne({ where: { id: userObj.id }});
            userDB.currentBalance.should.be.equal(userObj.balance);
        }
    });

});
