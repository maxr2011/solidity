const EventManager = artifacts.require('EventManager');
const Event = artifacts.require('Event');

contract('eventManager', accounts => {
    let eventManager = null;
    let admin = accounts[0];
    before(async () => {
        eventManager = await EventManager.deployed();
    });
    it('should be deployable', async () => {
        console.log(eventManager.address);
        assert(eventManager.address !== '');
    });
    async function userCount()
    {
        return await eventManager.getUserCount({from: admin});
    }
    it('should allow registration', async () => {
        const userCountBefore = await userCount();
        console.log('Old User-Count: ' + userCountBefore);

        await eventManager.register({from: admin}); // does not return the value.
        await eventManager.register({from: accounts[1]}); 
        await eventManager.register({from: accounts[2]}); 
        await eventManager.register({from: accounts[3]}); 
        //const id = await eventManager.register.call({ from: admin }); //.call() does not alter the state.

        const userCountAfter = await userCount();
        console.log('New User-Count: ' + userCountAfter);
        assert(userCountAfter - userCountBefore === 4, 'UserCount didn´t increment correctly.' 
                + userCountBefore + ' -> ' + userCountAfter);

        assert(await eventManager.getUserById(1, {from:admin}) === admin, 'Address of new user not saved.');
        assert(await eventManager.getUserById(2, {from:admin}) === accounts[1], 'Address of new user not saved.');
        assert(await eventManager.getUserById(3, {from:admin}) === accounts[2], 'Address of new user not saved.');
        assert(await eventManager.getUserById(4, {from:admin}) === accounts[3], 'Address of new user not saved.');
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
        await eventManager.createUserEvent(name,location,startTime,endTime, {from: admin});
        const eventCount = await eventManager.getEventCount({from: admin});
        const eventAddress = await eventManager.getEventById(eventCount, {from: admin});
        console.log('EventAddress: ' + eventAddress);
        assert(eventAddress !== '');
        const event = await Event.at(eventAddress);
        const info = await event.getInfo();
        assert(eventAddress === info[0], 'Event-Id wasn´t set to the contract address.');
        assert(admin === info[1], 'Event-Initiator wasn´t stored.');
        assert(name === info[2], 'Event-Name wasn´t stored.');
        assert(location === info[3], 'Event-Location wasn´t stored.');
        assert(startTime == info[4], 'Event-Start-Time wasn´t stored.');
        assert(endTime == info[5], 'Event-End-Time wasn´t stored.');
    });
    it('should remember events', async () => {
        const allEvents = await eventManager.getAllEvents({from: admin});
        
        const eventCount = await eventManager.getEventCount({from: admin});
        assert(allEvents.length === eventCount.toNumber(), 'EventCount != Number of Events');

        await eventManager.createUserEvent(name + '2',location + '2',startTime,endTime, {from: admin});
        
        const allEvents2 = await eventManager.getAllEvents({from: admin});

        const eventCount2 = await eventManager.getEventCount({from: admin});
        assert(allEvents2.length === eventCount2.toNumber(), 'EventCount != Number of Events');
    });
    it('should show only own events', async () => {
        const events0 = await eventManager.getUserEvents({from: admin});
        const events1 = await eventManager.getUserEvents({from: accounts[1]});
        const events2 = await eventManager.getUserEvents({from: accounts[2]});
        const events3 = await eventManager.getUserEvents({from: accounts[3]});
        assert(events0.length === 2, 'showUserEvents does not work properly');
        assert(events1.length === 0, 'showUserEvents does not work properly');
        assert(events2.length === 0, 'showUserEvents does not work properly');
        assert(events3.length === 0, 'showUserEvents does not work properly');
    });
    async function eventCount (account = admin){
        const eventCount = await eventManager.getEventCount({from: account});
        console.log("count = " + eventCount);
    }
});