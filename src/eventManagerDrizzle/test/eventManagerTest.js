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
        await eventManager.register({from: accounts[1]}); 
        await eventManager.register({from: accounts[2]}); 
        await eventManager.register({from: accounts[3]}); 
        //const id = await eventManager.register.call({ from: accounts[0] }); //.call() does not alter the state.

        const userCountAfter = await eventManager.getUserCount({from: accounts[0]});
        console.log('New User-Count: ' + userCountAfter);
        assert(userCountAfter - userCountBefore === 4, 'UserCount didn´t increment correctly.');

        assert(await eventManager.getUserById(1, {from:accounts[0]}) === accounts[0], 'Address of new user not saved.');
        assert(await eventManager.getUserById(2, {from:accounts[0]}) === accounts[1], 'Address of new user not saved.');
        assert(await eventManager.getUserById(3, {from:accounts[0]}) === accounts[2], 'Address of new user not saved.');
        assert(await eventManager.getUserById(4, {from:accounts[0]}) === accounts[3], 'Address of new user not saved.');
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
    let startTime = 2595424765, endTime = 3595424765;
    let name = 'Bingo', location = 'Park';
    it('should allow new Events', async () => {
        await eventManager.createUserEvent(name,location,startTime,endTime, {from: accounts[0]});
        const eventCount = await eventManager.getEventCount({from: accounts[0]});
        const eventAddress = await eventManager.getEventById(eventCount, {from: accounts[0]});
        console.log('EventAddress: ' + eventAddress);
        assert(eventAddress !== '');
        const event = await Event.at(eventAddress);
        const info = await event.getInfo();
        assert(eventAddress === info[0], 'Event-Id wasn´t set to the contract address.');
        assert(accounts[0] === info[1], 'Event-Initiator wasn´t stored.');
        assert(name === info[2], 'Event-Name wasn´t stored.');
        assert(location === info[3], 'Event-Location wasn´t stored.');
        assert(startTime == info[4], 'Event-Start-Time wasn´t stored.');
        assert(endTime == info[5], 'Event-End-Time wasn´t stored.');
    });
    it('should remember events', async () => {
        const allEvents = await eventManager.getAllEvents({from: accounts[0]});
        
        const eventCount = await eventManager.getEventCount({from: accounts[0]});
        assert(allEvents.length === eventCount.toNumber(), 'EventCount != Number of Events');

        await eventManager.createUserEvent(name + '2',location + '2',startTime,endTime, {from: accounts[0]});
        
        const allEvents2 = await eventManager.getAllEvents({from: accounts[0]});

        const eventCount2 = await eventManager.getEventCount({from: accounts[0]});
        assert(allEvents2.length === eventCount2.toNumber(), 'EventCount != Number of Events');
    });
    it('should show only own events', async () => {
        const events0 = await eventManager.getUserEvents({from: accounts[0]});
        const events1 = await eventManager.getUserEvents({from: accounts[1]});
        const events2 = await eventManager.getUserEvents({from: accounts[2]});
        const events3 = await eventManager.getUserEvents({from: accounts[3]});
        assert(events0.length === 2, 'showUserEvents does not work properly');
        assert(events1.length === 0, 'showUserEvents does not work properly');
        assert(events2.length === 0, 'showUserEvents does not work properly');
        assert(events3.length === 0, 'showUserEvents does not work properly');
    });

});