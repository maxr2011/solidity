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
    EventStorage.EventSet           private event_storage;              // event storage
    
    address                 payable private admin = 0xad67a760e4Cb77e19F1B7B79d6B4901B5360DEF1;     // admin address
    
    // ADMIN ACCESS 
    // only admin can see or change sensible data
    modifier onlyAdmin {
        require(msg.sender == admin, "Access denied");
        _;
    }
    
    // CONSTRUCTOR 
    // this is only called once with the final version
    constructor() public onlyAdmin
    { }
    
    // INIT STORAGE 
    // this function must be called immediately after Constructor and helps to save gas costs 
    function init_storage() public onlyAdmin 
    {
        // create users and events sets where the addresses are stored 
        user_storage            = new SetStorage.Set();
        
        // create event storage set 
        event_storage           = new EventStorage.EventSet();
    }
    
    // EXPORT STORAGE 
    // for future upgrades 
    function export_storage() public view onlyAdmin returns (address user_storage_address, address event_storage_address)
    {
        return (address(user_storage), address(event_storage));
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
        // event_address_storage.addToArray(address(new_event));
        
        // return event address 
        return address(new_event);
    }
    
    
    // get event count
    // access: admin only 
    function getEventCount() public view onlyAdmin returns(uint256 event_count) 
    {
        return event_storage.getElementCount();
    }
    
    // get event by id 
    // access: admin only 
    function getEventById(uint event_id) public view onlyAdmin returns(EventContract.Event event_element)
    {
        return event_storage.getByPosition(event_id);
    }
    
    // get event position 
    // access: user only 
    function getEventPosition(address event_address) public view onlyUser returns(uint event_position)
    {
        return event_storage.getPosition(event_address);
    }
    
    // get event info 
    // access: user only
    function getEventInfo(EventContract.Event event_address) public view onlyUser
    returns(
        address         event_id, 
        address         event_initiator,
        string memory   event_name,
        string memory   event_location,
        uint256         event_start_time,
        uint256         event_end_time,
        uint256         event_created_time,
        SetStorage.Set  event_participants
    ) {
        // return event info 
        return event_address.getInfo();
    }
    
    // get all events 
    // access: admin only 
    function getAllEvents() public view onlyAdmin returns(EventContract.Event [] memory all_events)
    {
        // return event array 
        return event_storage.getEventArray();
    }

    // get user events
    // access: user only 
    function getUserEvents() public view onlyUser returns(address [] memory user_events) 
    {
        // return user event array 
        return event_storage.getUserEventArray(msg.sender, false);
    }
    
    // get events where user participates 
    // access: user only 
    function getUserParticipantEvents() public view onlyUser returns(address [] memory user_participant_events) 
    {
        // return user participant event array 
        return event_storage.getUserEventArray(msg.sender, true);
    }
    
    // participate at an event 
    // access: user only 
    function participateEventById(EventContract.Event event_address) public onlyUser 
    {
        // participate at an event 
        event_address.participate(msg.sender);
    }
    
    // get event participants 
    // access: user only 
    function getEventParticipants(EventContract.Event event_address) public view onlyUser returns(address [] memory participants_array)
    {
        return event_address.getParticipantsArray();
    }
    
    
    // propose new event item 
    // access: user only 
    function createUserEventItem(EventContract.Event event_address, string memory event_item_name) public onlyUser 
    {
        // create a new item 
        event_address.proposeItemToBringWith(msg.sender, event_item_name); 
    }
    
    // get event item info 
    // access: user only 
    function getEventItemInfo(EventContract.Event event_address, uint event_item_id) public view onlyUser 
    returns (
        uint256                 item_id, 
        address     payable     item_holder,
        string      memory      item_name, 
        uint256                 item_time_expiration,
        bool                    item_checked
    )
    {
        return event_address.getItemInfo(event_item_id);
    }
    
    // get event item count 
    // access: user only 
    function getEventItemCount(EventContract.Event event_address) public view onlyUser 
    returns (uint item_count) 
    {
        return event_address.getItemCount();
    }
    
    // update item state 
    // access: user only 
    function updateEventItemState(EventContract.Event event_address, uint item_id) public onlyUser 
    {
        event_address.updatePartyItemCheck(msg.sender, item_id);
    }
    
    // remove event item 
    // access: user only 
    function removeEventItem(EventContract.Event event_address, uint event_item_id) public onlyUser
    {
        event_address.deletePartyItem(msg.sender, event_item_id);
    }
    
    // remove event 
    // access: user only 
    function removeEvent(EventContract.Event event_address) public onlyUser 
    {
        event_storage.removeFromArray(event_address, msg.sender);    
    }
    
}