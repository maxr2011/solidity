const EventManager = artifacts.require('EventManager');

contract('eventManager', accounts => {
    let eventManager = null;
    before(async () => {
        eventManager = await EventManager.deployed();
        eventManager.init_storage();
    });
    it('should be deployable', async () => {
        console.log(eventManager.address);
        assert(eventManager.address !== '');
    });
    it('should allow registration', async () => {
        await eventManager.register({from: accounts[0]}); // does not return the value.
        //const id = await eventManager.register.call({ from: accounts[0] }); //.call() does not alter the state.
    });
    it("should reject double registering", async () => {
        try {
            await eventManager.register({from: accounts[2]});
            await eventManager.register({from: accounts[2]});
            assert.fail("User was able to register twice.");
        }
        catch (err) {
            assert(err.message.includes('revert'),"true not equal true");
        }
        
    });

});