const { assert } = require("console");

const EventManager = artifacts.require('EventManager');

contract('eventManager', () => {
    it('should be deployable', async () => {
        const eventManager = await EventManager.deployed();
        console.log(eventManager.address);
        assert(eventManager.address !== '');
    });
});