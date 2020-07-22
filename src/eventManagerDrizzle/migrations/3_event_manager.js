const StorageSet = artifacts.require("Set");
const StorageEventSet = artifacts.require("EventSet");
var eventManager = artifacts.require('EventManager');

module.exports = function(_deployer) {

  _deployer.then(async() => {

    let Storage_Set = await StorageSet.deployed();
    let StorageEvent_Set = await StorageEventSet.deployed();

    await _deployer.deploy(eventManager, Storage_Set.address, StorageEvent_Set.address);
    
  });

};
