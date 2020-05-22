pragma solidity ^0.6.7;

// import storage 
import "eventManager/Storage/Set.sol" as SetStorage;
import "eventManager/Storage/EventSet.sol" as EventStorage;

// import event contract
import "eventManager/Event.sol" as EventContract;

// EVENTMANAGER 
// Governance Contract
// This contract manages 
// - User Account Creation 
// - Event Creation and Management by the User itself 
contract EventManager {
    
    // VARIABLES  
    SetStorage.Set                  private user_storage;               // user address storage 
    SetStorage.Set                  private event_address_storage;      // event address storage
    
    EventStorage.EventSet           private event_storage;              // event storage
    
    address                 payable private admin;                      // admin address
    
    // CONSTRUCTOR 
    // this is only called once with the final version
    constructor() public 
    {
        // create users and events sets where the addresses are stored 
        user_storage            = new SetStorage.Set();
        event_address_storage   = new SetStorage.Set();
        
        // create event storage set 
        event_storage           = new EventStorage.EventSet();
        
        // set admin address
        admin = 0xad67a760e4Cb77e19F1B7B79d6B4901B5360DEF1;  
        
        // add admin as first user 
        // users.addToArray(admin); // optional 
    }
    
    
    // ADMIN ACCESS 
    // only admin can see or change sensible data
    modifier onlyAdmin {
        require(msg.sender == admin, "Access denied");
        _;
    }
    
    
    // USER MANAGEMENT 
    
    // user authentication
    // only a user has access to his account, events, etc 
    modifier onlyUser {
        require(user_storage.inArray(msg.sender), "Access is only allowed for registered users");
        _;
    }
    
    // user login status  
    // access: everybody - every user has to log in
    function login() public view returns(bool is_user)
    {
        // return login status 
        return user_storage.inArray(msg.sender);
    }
    
    // user registration 
    // access: everybody can register
    function register() public 
    returns (uint user_id)
    {
        // user address 
        address payable user_address = msg.sender;
        
        // check if user is already registered 
        require(!user_storage.inArray(user_address), "User already registered");
        
        // register new user 
        user_storage.addToArray(user_address);
        
        // return user id 
        return user_storage.getPosition(user_address);
    }
    
    // get user count 
    // access: admin only
    function getUserCount() public view onlyAdmin returns(uint256 user_count)
    {
        return user_storage.getElementCount();
    }
    
    // get user address by id 
    // access: admin only
    function getUserById(uint256 id) public view onlyAdmin returns(address payable user_address) 
    {
        return payable(user_storage.getByPosition(id));
    }
    
    
    // EVENT MANAGEMENT
    
    // event creation 
    // access: user only 
    function createUserEvent( 
        string memory event_name, 
        string memory event_location, 
        uint256 event_start_time, 
        uint256 event_end_time    
    ) public onlyUser returns (address new_event_address)
    {
        // new event 
        EventContract.Event new_event = new EventContract.Event(msg.sender, event_name, event_location, event_start_time, event_end_time);
        
        // add event to event storage
        event_storage.addToArray(new_event);
        
        // add event address to event address storage 
        event_address_storage.addToArray(address(new_event));
        
        // return event address 
        return address(new_event);
    }
    
    // get event address by id 
    // access: admin only 
    function getEventAddressById(uint event_id) public view onlyAdmin returns(address event_address) 
    {
        return address(getEventById(event_id));
    }
    
    // get event by id 
    // access: admin only 
    function getEventById(uint event_id) public view onlyAdmin returns(EventContract.Event event_element)
    {
        return event_storage.getByPosition(event_id);
    }

    // get user events
    // check runtime - this can take very long
    // access: user only 
    function getUserEvents() public view onlyUser returns(EventContract.Event[] memory user_events) 
    {
        // counter 
        uint j = 0; 
        
        // iterate through event set
        // skip 0x0 address
        for(uint i = 1; i < event_storage.getElementCount(); i++)
        {
            // save a temporary event 
            EventContract.Event temporary_event = event_storage.getByPosition(i);
            
            // check if event was created by the user
            if(temporary_event.getInitiator() == msg.sender) 
            {
                user_events[j] = temporary_event;
                j++;
            }
        }
        
        // return user events 
        return user_events;
    }

    // get all events 
    // access: admin only 
    function getAllEvents() public view onlyAdmin returns(EventContract.Event[] memory all_events)
    {
        // counter 
        uint j = 0;
        
        // iterate through event set 
        // skip 0x0 address
        for(uint i = 1; i < event_storage.getElementCount(); i++)
        {
            all_events[j] = event_storage.getByPosition(i);
        }
        
        // return all events
        return all_events;
    }
    
    // get user event by id 
    
    
    
}