const EventManager = artifacts.require('EventManager');
const Event = artifacts.require('Event');

contract('eventManager', accounts => {
    before(async () => {
        eventManager = await EventManager.deployed();
        myAccounts = accounts;
        admin = accounts[0];
        // register half the accounts.
        await eventManager.register({from: admin}); 
        await eventManager.register({from: accounts[1]}); 
        await eventManager.register({from: accounts[2]}); 
        await eventManager.register({from: accounts[3]}); 
        await eventManager.register({from: accounts[4]}); 

        userEvents = [0,0,0,0,0];
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
});
// Events can only be accessed trough EventManager, but here are the Event-focused tests.
contract('event', accounts => {
    let event = null;
    let initiator = accounts[1];
    before(async () => {
        eventManager = await EventManager.deployed();

        for(i = 0; i < accounts.length; i++)
            await eventManager.register({from: accounts[i]}); 

        await createDummyEvent(initiator);
        const eventAddress = await eventManager.getEventById(await getEventCount(), {from: admin});
        assert(eventAddress !== '', 'Event Address is null.');
        event = await Event.at(eventAddress);
    });
    it('shouldn´t accept initiator as participant', async () => {
        try {
            await eventManager.participateEventById(event.address, {from: initiator});
            assert.fail('Initiator was able to participate at his own event.');
        }
        catch (err) {
            assert(err.message.includes('you are already the initiator'),'Error message did not include require-message.');
        }     
    });
    it('should allow other parcipitants to join', async () => {
        for(i = 2; i < 5; i++){
            await eventManager.participateEventById(event.address, {from: accounts[i]});
            const participants = await eventManager.getEventParticipants(event.address);
            assert(participants.includes(accounts[i]), accounts[i] + ' couldn´t participate');
        }
    });
    it('should exist a partyitem', async () => {
        await eventManager.createUserEventItem(event.address, 'Kuchen', {from: initiator});

        const itemCount = await eventManager.getEventItemCount(event.address, {from: accounts[2]});
        
        const itemIndex = itemCount - 1;

        const item = await eventManager.getEventItemInfo(event.address, itemIndex, {from: accounts[2]});

        assert(item[0].toNumber() === itemIndex, 'Item Index does not match');
        assert(item[1] === initiator, 'Item Creator Address doesn´t match');
        assert(item[2] === 'Kuchen', 'Der Kuchen fehlt');
        assert(item[3].toNumber() === startTime, 'Expiration Time of Event is wrong')
        assert(item[4] === false, 'New Items must not be checked');
    });
    it('shouldn´t allow items from non participant', async () => {
        try {
            await eventManager.createUserEventItem(event.address, 'Kuchen', {from: accounts[9]});
            assert.fail('Non-participant was able to propose item.');
        }
        catch (err) {
            assert(err.message.includes('User is not participant'),'Error message did not include require-message.' + err.message);
        } 
    });
    it('shouldn´t allow changing itemCheck by non initiator or non itemHolder', async () => {
        const itemCount = await eventManager.getEventItemCount(event.address, {from: accounts[9]});
    
        const itemIndex = itemCount - 1;
        try {
            await eventManager.updateEventItemState(event.address, itemIndex, {from: accounts[9]});
            assert.fail('Unauthorized account for changing eventItemState');
        }
        catch (err) {
            assert(err.message.includes('User is not allowed to update item info'),'Error message did not include require-message.' + err.message);
        } 
    });
    it('should allow changing itemCheck by initiator or itemHolder', async () => {
        const itemCount = await eventManager.getEventItemCount(event.address, {from: accounts[9]});
            
        const itemIndex = itemCount - 1;

        await eventManager.updateEventItemState(event.address, itemIndex, {from: initiator});
        
        await eventManager.participateEventById(event.address, {from: accounts[9]});

        await eventManager.createUserEventItem(event.address, 'Kuchen', {from: accounts[9]});
        
        const newItemIndex = itemIndex + 1;

        await eventManager.updateEventItemState(event.address, newItemIndex, {from: accounts[9]});
    });
});


let admin = null, myAccounts = null, eventManager = null;
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
let userEvents = [0,0,0,0,0];
let _accounts = null;
async function createDummyEvent(account)
{
    userEvents[myAccounts.indexOf(account)]++;
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