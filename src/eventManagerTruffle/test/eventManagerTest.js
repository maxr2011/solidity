const { assert } = require("console");

const EventManager = artifacts.require('EventManager');
const Event = artifacts.require('Event');

contract('eventManager', accounts => {
    let eventManager = null;
    let admin = accounts[0];
    let userEvents = [0,0,0,0,0];
    before(async () => {
        eventManager = await EventManager.deployed();
        // register half the accounts.
        await eventManager.register({from: admin}); 
        await eventManager.register({from: accounts[1]}); 
        await eventManager.register({from: accounts[2]}); 
        await eventManager.register({from: accounts[3]}); 
        await eventManager.register({from: accounts[4]}); 
    });
    it('should be deployable', async () => {
        assert(eventManager.address !== '');
    });
    it('should allow registration of unregistered account', async () => {
        const userCountBefore = await userCount();

        await eventManager.register({from: accounts[5]}); 

        assert((await userCount() - userCountBefore) === 1, 'UserCount didn´t increment.');
        assert(await getUserById(6) === accounts[5], 'Address of new user not saved.');
    });
    it('should reject double registering', async () => {
        try {
            await eventManager.register({from: accounts[2]});
            assert.fail('User was able to register twice.');
        }
        catch (err) {
            assert(err.message.includes('revert'),'Error message did not include revert');
        }
        
    });
    it('should allow new Events', async () => {
        await createDummyEvent(admin);
        const eventAddress = await eventManager.getEventById(await getEventCount(), {from: admin});
        assert(eventAddress !== '', 'Event Address is null.');
        const event = await Event.at(eventAddress);
        const info = await event.getInfo();
        compareEventInfoWithDummy(info, eventAddress, admin);
    });
    it('should save events and increment eventCounter', async () => {
        let count = 0;
        for(i = 0; i < 3; i++){
            await createDummyEvent(accounts[1]);

            const allEvents = await getAllEvents();
            
            const eventCount = (await getEventCount()).toNumber();

            assert(allEvents.length === eventCount, 'EventCount != Number of Events');

            assert(count < eventCount, 'Didn´t increment eventCounter');

            count = eventCount;
        }
    });
    it('should only show own events', async () => {
        for(i = 0; i < 5; i++){ // only registered accounts.
            const events = await eventManager.getUserEvents({from: accounts[i]});
            assert(events.length === userEvents[i], 'userEventCount does not match the number of created events.');
        }
    });
    async function getEventCount (account = admin){
        return await eventManager.getEventCount({from: account});
    }
    function compareEventInfoWithDummy(eventInfo, eventAddress, account)
    {
        assert(eventAddress === eventInfo[0], 'Event-Id wasn´t set to the contract address.');
        assert(account === eventInfo[1], 'Event-Initiator wasn´t stored.');
        assert(name === eventInfo[2], 'Event-Name wasn´t stored.');
        assert(location === eventInfo[3], 'Event-Location wasn´t stored.');
        assert(startTime == eventInfo[4], 'Event-Start-Time wasn´t stored.');
        assert(endTime == eventInfo[5], 'Event-End-Time wasn´t stored.');
    }
    async function getAllEvents(){
        return await eventManager.getAllEvents({from: admin});
    }
    let startTime = 2595424765, endTime = 3595424765;
    let name = 'Bingo', location = 'Park';
    async function createDummyEvent(account)
    {
        userEvents[accounts.indexOf(account)]++;
        await eventManager.createUserEvent(name,location,startTime,endTime, {from: account});
    }
    async function userCount()
    {
        return await eventManager.getUserCount({from: admin});
    }
    async function getUserById(id)
    {
        return await eventManager.getUserById(id, {from:admin})
    }
});