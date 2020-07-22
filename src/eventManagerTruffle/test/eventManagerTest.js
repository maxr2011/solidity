const { assert } = require("console");

const EventManager = artifacts.require('EventManager');

contract('eventManager', () => {
    let eventManager = null;
    before(async () => {
        eventManager = await EventManager.deployed();
    });
    it('should be deployable', async () => {
        console.log(eventManager.address);
        assert(eventManager.address !== '');
    });

});