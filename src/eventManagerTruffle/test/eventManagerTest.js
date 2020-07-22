const { assert } = require("console");

const EventManager = artifacts.require('EventManager');
const Event = artifacts.require('Event');

contract('eventManager', accounts => {
    let eventManager = null;
    before(async () => {
        eventManager = await EventManager.deployed();
        //eventManager.init_storage(); not needed anymore.
    });
    it('should be deployable', async () => {
        console.log(eventManager.address);
        assert(eventManager.address !== '');
    });
    it('should allow registration', async () => {
        const userCountBefore = await eventManager.getUserCount({from: accounts[0]});
        console.log('Old User-Count: ' + userCountBefore);

        await eventManager.register({from: accounts[0]}); // does not return the value.
        //const id = await eventManager.register.call({ from: accounts[0] }); //.call() does not alter the state.

        const userCountAfter = await eventManager.getUserCount({from: accounts[0]});
        console.log('New User-Count: ' + userCountAfter);
        assert(userCountAfter > userCountBefore, 'UserCount didn´t increment.');

        const newMember = await eventManager.getUserById(userCountAfter);
        assert(newMember === accounts[0], 'Address of new user not saved.');
    });
    it('should reject double registering', async () => {
        try {
            await eventManager.register({from: accounts[2]});
            await eventManager.register({from: accounts[2]});
            assert.fail('User was able to register twice.');
        }
        catch (err) {
            assert(err.message.includes('revert'),'Error message did not include revert');
        }
        
    });
    it('should allow new Events', async () => {
        await eventManager.createUserEvent('Bingo','Park',2595424765,3595424765, {from: accounts[0]});
        const eventCount = await eventManager.getEventCount({from: accounts[0]});
        const eventAddress = await eventManager.getEventById(eventCount, {from: accounts[0]});
        console.log('EventAddress: ' + eventAddress);
        assert(eventAddress !== '');
        const event = await Event.at(eventAddress);
        const info = await event.getInfo();
        assert('Bingo' === info[2], 'Event-Name wasn´t stored.');
        assert('Park' === info[3], 'Event-Location wasn´t stored.');
    });

});