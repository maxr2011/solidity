const { assert } = require("console");

const EventManager = artifacts.require('EventManager');

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
        assert(userCountAfter - userCountBefore === 1);

        const newMember = await eventManager.getUserById(userCountAfter);
        assert(newMember === accounts[0]);
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

});