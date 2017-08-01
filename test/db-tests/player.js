const sequalizeInstace = require('db/adapter');
const Player = require('db/models').Player;
const should = require('should');

describe('Player model', () => {
    before(async function() {
        await sequalizeInstace.sync({ force: true });
    });

    describe(`updatePlayerBalance`, async () => {
        before(async () => {
            await Player.create({
                id: 1
            })
        });

        it(`Should return error if player balance lt 0`, async () => {
            const player = await Player.findOne({ where: { id: 1 }});

            try {
                await player.updateCurrentBalance(-200);
            } catch(e) {
                should.exist(e);
            }


            const updatedPlayer = await Player.findOne({ where: { id: 1 }});
            updatedPlayer.currentBalance.should.be.equal(0);
        });

        it(`Should update player balance`, async () => {
            const player = await Player.findOne({ where: { id: 1 }});
            await player.updateCurrentBalance(200);

            const updatedPlayer = await Player.findOne({ where: { id: 1 }});
            updatedPlayer.currentBalance.should.be.equal(200);
        });
    });
});
