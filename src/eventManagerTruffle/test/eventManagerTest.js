const { assert } = require("console");

const EventManager = artifacts.require('EventManager');
const Event = artifacts.require('Event');

let admin = null, eventManager = null;

contract('eventManager', accounts => {
    let doubleRegisterer = accounts[2], eventCreator = accounts[3], tripleEventCreator = accounts[4];
    before(async () => {
        eventManager = await EventManager.deployed();
        admin = accounts[0];
    });
    it('should be deployable', async () => {
        assert(eventManager.address !== '');
        
        assert(await userCount() === 0, 'At the start there shouldn´t be any registered accounts');
    });
    it('should allow registration of unregistered accounts', async () => {
        const userCountBefore = await userCount();
        
        for(i = 0; i < accounts.length; i++)
            await eventManager.register({from: accounts[i]}); 

        const userCountAfter = await userCount();

        assert(userCountAfter - userCountBefore === accounts.length, 'UserCount didn´t increment correctly.');
        assert(await getUserById(userCountAfter) === accounts[userCountAfter - 1], 'Address of new user not saved.');
    });
    it('should reject double registering', async () => {
        try {
            await eventManager.register({from: doubleRegisterer});
            assert.fail('User was able to register twice.');
        }
        catch (err) {
            assert(err.message.includes('revert'),'Error message did not include revert');
        }        
    });
    it('should allow new Events', async () => {
        await createDummyEvent(eventCreator);

        const eventAddress = await eventManager.getEventById(await getEventCount(), {from: admin});
        assert(eventAddress !== '', 'Event Address is null.');

        const event = await Event.at(eventAddress);
        const info = await event.getInfo();

        compareEventInfoWithDummy(info, eventAddress, eventCreator); // assert-statements inside.
    });
    it('should increment eventCounter when creating event', async () => {
        let count = 0;
        for(i = 0; i < 3; i++){
            await createDummyEvent(tripleEventCreator);

            const allEvents = await getAllEvents();
            
            const eventCount = (await getEventCount()).toNumber();

            assert(allEvents.length === eventCount, 'EventCount != Number of Events');

            assert(count < eventCount, 'Didn´t increment eventCounter');

            count = eventCount;
        }
    });
    it('should only show own events', async () => {
        for(i = 0; i < accounts.length; i++){
            const events = await eventManager.getUserEvents({from: accounts[i]});
            
            if(accounts.indexOf(eventCreator) === i)
            {
                assert(events.length === 1, 'userEventCount does not match the number of created events.');
            }
            else if(accounts.indexOf(tripleEventCreator) === i)
            {
                assert(events.length === 3, 'userEventCount does not match the number of created events.');
            }
            else {
                assert(events.length === 0, 'userEventCount does not match the number of created events.');
            }
        }
    });
});
// Events can only be accessed trough EventManager, but here are the Event-focused tests.
contract('event', accounts => {
    let event = null;
    let initiator = accounts[1], otherParticipants = [accounts[2],accounts[3],accounts[4],accounts[5]];
    let itemCreator = accounts[6], noParticipant = accounts[7];
    before(async () => {
        eventManager = await EventManager.deployed();
        admin = accounts[0];

        for(i = 0; i < accounts.length; i++)
            await eventManager.register({from: accounts[i]}); 

        // create and save test event.
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
        for(i = 0; i < otherParticipants.length; i++){
            const participant = otherParticipants[i];
            await eventManager.participateEventById(event.address, {from: participant});
            const participants = await eventManager.getEventParticipants(event.address);
            assert(participants.includes(participant), participant + ' couldn´t participate');
        }
    });
    it('should exist a partyitem', async () => {
        await eventManager.participateEventById(event.address, {from: itemCreator});

        await eventManager.createUserEventItem(event.address, 'Kuchen', {from: itemCreator});

        const itemCount = await eventManager.getEventItemCount(event.address, {from: itemCreator});
        
        const itemIndex = itemCount - 1;

        const item = await eventManager.getEventItemInfo(event.address, itemIndex, {from: itemCreator});

        assert(item[0].toNumber() === itemIndex, 'Item Index does not match');
        assert(item[1] === itemCreator, 'Item Creator Address doesn´t match');
        assert(item[2] === 'Kuchen', 'Der Kuchen fehlt');
        assert(item[3].toNumber() === startTime, 'Expiration Time of Event is wrong')
        assert(item[4] === false, 'New Items must not be checked');
    });
    it('shouldn´t allow items from non participant', async () => {
        try {
            await eventManager.createUserEventItem(event.address, 'Kuchen', {from: noParticipant});
            assert.fail('Non-participant was able to propose item.');
        }
        catch (err) {
            assert(err.message.includes('User is not participant'),'Error message did not include require-message.' + err.message);
        } 
    });
    it('shouldn´t allow changing itemCheck by non initiator or non itemHolder', async () => {
        const user = otherParticipants[0];

        const itemCount = await eventManager.getEventItemCount(event.address, {from: user});
    
        const itemIndex = itemCount - 1;
        try {
            await eventManager.updateEventItemState(event.address, itemIndex, {from: user});
            assert.fail('Unauthorized account for changing eventItemState');
        }
        catch (err) {
            assert(err.message.includes('User is not allowed to update item info'),'Error message did not include require-message.' + err.message);
        } 
    });
    it('should allow changing itemCheck by initiator', async () => {
        const itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});
            
        const itemIndex = itemCount - 1;

        const isChecked = await eventManager.getEventItemInfo(event.address, itemIndex, {from: noParticipant});

        await eventManager.updateEventItemState(event.address, itemIndex, {from: initiator});
        
        const isStillChecked = await eventManager.getEventItemInfo(event.address, itemIndex, {from: noParticipant})

        assert(isChecked !== isStillChecked, 'initiator coudn´t update ItemChecked');
    });
    it('should allow changing itemCheck by itemHolder', async () => {        
        const itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});
            
        const itemIndex = itemCount - 1;

        const isChecked = await eventManager.getEventItemInfo(event.address, itemIndex, {from: noParticipant});

        await eventManager.updateEventItemState(event.address, itemIndex, {from: itemCreator});
        
        const isStillChecked = await eventManager.getEventItemInfo(event.address, itemIndex, {from: noParticipant})

        assert(isChecked !== isStillChecked, 'initiator coudn´t update ItemChecked');
    });
    it('should be possible to remove all eventItems by initiator', async () => {
        let itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});

        for(i = itemCount.toNumber(); i > 0; i--)
        {
            await eventManager.removeEventItem(event.address, 0, {from: initiator});
        }
        itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});

        assert(itemCount.toNumber() === 0, 'It was not possible to remove all events');
    });
    it('should be possible to remove all participants by themselves', async () => {
        let eventParticipants = await eventManager.getEventParticipants(event.address, {from: noParticipant});
        
        for(i = 0; i < eventParticipants.length; i++)
        {
            await eventManager.removeParticipant(event.address, eventParticipants[i], {from: eventParticipants[i]});
        }
        eventParticipants = await eventManager.getEventParticipants(event.address, {from: noParticipant});
        
        assert(eventParticipants.length === 0, 'It was not possible to remove all participants');
    });
    it('should be possible to re-add participants', async () => {
        for(i = 0; i < accounts.length; i++)       
        {
            if(accounts[i] == initiator) continue;

            await eventManager.participateEventById(event.address, {from: accounts[i]});
        }
        const participants = await eventManager.getEventParticipants(event.address, {from: noParticipant});
        
        assert(participants.length === accounts.length - 1, 'Coudn´t add all accounts'); // intítiator does not count as participant.
    });
    it('should be possible to re-add eventItems', async () => {
        for(i = 0; i < accounts.length; i++)
        {
            await eventManager.createUserEventItem(event.address, 'Kuchen', {from: accounts[i]});
        }
        const itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});
        
        assert(itemCount.toNumber() === accounts.length, 'Not every participant could add an item');
    });
    it('should be possible to remove all eventItems by the participants themselves', async () => {
        let itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});

        for(i = itemCount; i > 0; i--)
        {   
            const info = await eventManager.getEventItemInfo(event.address, 0, {from: noParticipant})
            
            const itemHolder = info[1];

            await eventManager.removeEventItem(event.address, 0, {from: itemHolder});
        }
        itemCount = await eventManager.getEventItemCount(event.address, {from: noParticipant});

        assert(itemCount.toNumber() === 0, 'It was not possible to remove all events');
    });
    it('should be possible to remove all participants by the initiator', async () => {
        let eventParticipants = await eventManager.getEventParticipants(event.address, {from: noParticipant});
        
        for(i = 0; i < eventParticipants.length; i++)
        {
            await eventManager.removeParticipant(event.address, eventParticipants[i], {from: initiator});
        }
        eventParticipants = await eventManager.getEventParticipants(event.address, {from: noParticipant});
        
        assert(eventParticipants.length === 0, 'It was not possible to remove all participants');
    });
    it('should be possible to remove an event by initiator', async () => {
        let allEvents = await eventManager.getAllEvents({from: admin});
        
        assert(allEvents.length === 1, 'There should only be 1 event');

        await eventManager.removeEvent(event.address, {from: initiator});

        allEvents = await eventManager.getAllEvents({from: admin});
        
        assert(allEvents.length === 0, 'There shouldn´t be any event');
    });
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
    await eventManager.createUserEvent(name,location,startTime,endTime, {from: account});
}
async function userCount()
{
    return (await eventManager.getUserCount({from: admin})).toNumber();
}
async function getUserById(id)
{
    return await eventManager.getUserById(id, {from:admin})
}