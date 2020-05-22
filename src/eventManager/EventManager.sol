pragma solidity ^0.6.7;

import "eventManager/Set.sol" as SetStorage;
import "eventManager/Event.sol" as EventContract;

// EVENTMANAGER 
// Governance Contract
// This contract manages 
// - User Account Creation 
// - Event Creation and Management by the User itself 
contract EventManager {
    
    // VARIABLES  
    SetStorage.Set          private users;
    SetStorage.Set          private events;
    
    // CONSTRUCTOR 
    constructor() public 
    {
        users   = new SetStorage.Set();
        events  = new SetStorage.Set();
    }
    
    
    // USER MANAGEMENT 
    
    // user authentication
    // only a user has access to his account, events, etc 
    modifier onlyUser {
        require(users.inArray(msg.sender), "Access is only allowed for registered users");
        _;
    }
    
    // user login status  
    function login() public view returns(bool is_user)
    {
        // return login status 
        return users.inArray(msg.sender);
    }
    
    // user registration 
    function register() public 
    {
        // user address 
        address payable user_address = msg.sender;
        
        // check if user is already registered 
        require(!users.inArray(user_address), "User already registered");
        
        // register new user 
        users.addToArray(user_address);
    }
    
    // get user count 
    function getUserCount() public view returns(uint256 user_count)
    {
        return users.getElementCount();
    }
    
    // get user address by id 
    function getUserById(uint256 id) public view returns(address payable user_address) 
    {
        return payable(users.getByPosition(id));
    }
    
    
    // EVENT MANAGEMENT
    
    // event creation 
    function createUserEvent( 
        string memory event_name, 
        string memory event_location, 
        uint256 event_start_time, 
        uint256 event_end_time    
    ) public onlyUser 
    {
        // new event 
        EventContract.Event new_event = new EventContract.Event(msg.sender, event_name, event_location, event_start_time, event_end_time);
        
        // add event to list
        events.addToArray(address(new_event));
    }
    
    // get user events
    function getUserEvents() public view onlyUser returns(address[] memory user_events) {
        
    }
    
    // get user event by id 
    
    
    
}