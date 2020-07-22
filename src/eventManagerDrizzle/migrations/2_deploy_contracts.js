const StorageSet = artifacts.require("Set");
const Event = artifacts.require("Event");
const StorageEventSet = artifacts.require("EventSet");
const EventManager = artifacts.require("EventManager");

module.exports = (deployer, network, accounts) => {
    
    deployer.deploy(StorageSet);
    deployer.link(StorageSet, Event);
    deployer.link(StorageSet, EventManager);

    const userAdress = accounts[1];
    deployer.deploy(Event, userAdress, "startEvent", "truffleSuite", 1603629457, 1608581541);

    deployer.link(Event, StorageEventSet);
    deployer.link(Event, EventManager);

    deployer.deploy(StorageEventSet);
    deployer.link(StorageEventSet, EventManager);

    //deployer.deploy(EventManager, StorageSet.address, StorageEventSet.address);

}