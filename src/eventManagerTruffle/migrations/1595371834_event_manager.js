var eventManager = artifacts.require('EventManager');

module.exports = function(_deployer) {
  
  _deployer.deploy(eventManager);

};
