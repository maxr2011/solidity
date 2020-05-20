pragma solidity ^0.6.7;

import "eventManager/Set.sol" as SetStorage;
import "eventManager/Event.sol" as EventContract;

// Governance Contract 
// This contract manages 
// - User Account Creation 
// - Event Creation and Management by the User itself 
contract EventManager {
    
    // variables 
    SetStorage.Set  private users;
    SetStorage.Set  private events;
    
    // user authentication 
    
    // event creation 
    
    // get user events
    function getUserEvents(address user) public view returns(address[] memory user_events) {
        
    }
    
    
}