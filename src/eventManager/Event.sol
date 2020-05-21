pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;

import "eventManager/Set.sol" as SetStorage;

// Event contract
contract Event {
    
    // variables
    address             private id;                      // contract address of the event 
    address             payable private manager;         // event manager contract address
    address             payable private initiator;       // owner address of the creator
    SetStorage.Set      private participants;            // owner addresses of participants
    string              private name;                    // name of the event 
    string              private description;             // description of the event 
    string              private location;                // location of the event
    uint256             private time_created;            // when the event was created   - in unix time format
    uint256             private time_start;              // when the event starts        - in unix time format
    uint256             private time_end;                // when the event ends          - in unix time format 
    uint256             private time_expiration;         // when the event expires       - in unix time format 
    
    // check for event manager contract
    // only manager has write access
    modifier onlyManager {
        require(msg.sender == manager, "Access is only allowed for manager.");
        _;
    }
    
    PartyItem[] public party_items;                     // items to bring with 
    
    // party item 
    struct PartyItem 
    {
        uint256                 item_id;                                // id of the item
        address     payable     holder;                                 // participant who brings the item
        string                  name;                                   // name of the item 
        uint256                 time_expiration;                        // when the item expires
        bool                    checked;                                // wether the item is already brought or not 
    }
    
    // constructor with required parameters
    constructor(address payable event_creator, 
                string memory event_name, 
                string memory event_location, 
                uint256 start_time, 
                uint256 end_time) public
    {
        
        // assign variables
        id              = address(this);            // set id to this contract address                         
        initiator       = event_creator;            // set initiator to event creator address 
                                                    // at the time of creation there are 0 participants
        manager         = msg.sender;               // set manager to event manager contract address
        name            = event_name;               // set event name
                                                    // description is optional 
        location        = event_location;           // set event location
        time_created    = now;                      // set created time to now
        time_start      = start_time;               // set start time 
        time_end        = end_time;                 // set end time
        time_expiration = start_time;               // expiration time is start time by default 
                                                    // users cannot attend the event any more if it has already started
        participants    = new SetStorage.Set();     // create Set for participants 
                                                    // at the time of creation there are 0 party items
        
        // do some logic checks 
        require(time_start < time_end, "event start time must be before end time");
        require(time_start > now, "event start time must be in the future");
                    
    }
    
    // getter and setter
    
    // get event info 
    function getInfo() public view onlyManager
    returns (
        address         event_id, 
        address         event_initiator,
        string memory   event_name,
        string memory   event_location,
        uint256         event_start_time,
        uint256         event_end_time,
        uint256         event_created_time,
        SetStorage.Set  event_participants
    )
    {
        return (id, 
                initiator,
                name,
                location,
                time_start,
                time_end,
                time_created,
                participants);
    }
    
    // get single element info 
    function getId()                public view onlyManager returns(address         event_id)               { return id; }                  // returns event id
    function getManager()           public view onlyManager returns(address         event_manager)          { return manager; }             // returns event manager 
    function getInitiator()         public view onlyManager returns(address         event_initiator)        { return initiator; }           // returns event initiator
    function getParticipants()      public view onlyManager returns(SetStorage.Set  event_participants)     { return participants; }        // returns event participants
    function getName()              public view onlyManager returns(string memory   event_name)             { return name; }                // returns event name 
    function getDescription()       public view onlyManager returns(string memory   event_description)      { return description; }         // returns event description
    function getLocation()          public view onlyManager returns(string memory   event_location)         { return location; }            // returns event location
    function getTimeCreated()       public view onlyManager returns(uint256         event_time_created)     { return time_created; }        // returns event creation time 
    function getTimeStart()         public view onlyManager returns(uint256         event_time_start)       { return time_start; }          // returns event start time 
    function getTimeEnd()           public view onlyManager returns(uint256         event_time_end)         { return time_end; }            // returns event end time 
    function getExpirationTime()    public view onlyManager returns(uint256         event_time_expiration)  { return time_expiration; }     // returns event time expiration 
    
    
    // attend this event 
    function participate(address payable participant) public onlyManager
    {
        // check if participant is not the initiator
        require(participant != initiator, "you are already the initiator");
        
        // check if event is not expired 
        require(time_expiration > now, "event is expired");
        
        // add participant address
        participants.addToArray(msg.sender);
    }
    
    // remove participant 
    function removeParticipant(address remove_participant) public onlyManager 
    {
        // remove participant
        participants.removeFromArray(remove_participant);
    }
    
    // update event name 
    function updateName(string memory new_name) public onlyManager
    {
        // set new name 
        name = new_name;
    }
    
    // update event location 
    function updateLocation(string memory new_location) public onlyManager
    {
        // set new location 
        location = new_location;
    }
    
    // set the event description
    function setDescription(string memory new_description) public onlyManager
    {
        // set the new description
        description = new_description;
    }
    
    // set the start time 
    function setStartTime(uint256 time) public onlyManager
    {
        // check if start time is before end time 
        require(time < time_end, "event start time must be before end time");
        
        // set new start time
        time_start = time;
    }
    
    // set the end time
    function setEndTime(uint256 time) public onlyManager
    {
        // check if end time is after start time 
        require(time > time_start, "event end time must be after start time");
        
        // set new end time
        time_end = time;
    }
    
    // set the expiration time 
    // till when can users attend the event 
    function setExpirationTime(uint256 time) public onlyManager
    {
        // check if expiration time is before or at start time
        require(time <= time_start, "event expiration time must be before start time");
        
        // set new expiration time 
        time_expiration = time;
    }
    
    // check if participant
    function isParticipant(address payable user) public view onlyManager returns(bool is_participant)
    {
        // check if address is in participants set 
        return participants.inArray(user);
    }
    
    // get all participants
    function getAllParticipants() public view onlyManager returns(address [] memory all_participants) 
    {
        // todo implement
    }
    
    // manage party items 
    
    // add party item
    function proposeItemToBringWith(address payable user_address, string memory item_name) public onlyManager
    {
        // check if user is initiator or participant
        require((user_address == initiator) || (isParticipant(user_address)), "User is not participant");
        
        // new party item id 
        uint256 party_item_id = getItemCount();
        
        // insert new party item to the array 
        // by default the time_expiration is the same as the one from the event and is checked is false
        party_items.push(PartyItem(party_item_id, user_address, item_name, time_expiration, false));
    }
    
    // get item count 
    function getItemCount() public view onlyManager returns(uint256 item_count) 
    {
        return party_items.length;
    }
    
    // get item info 
    
    // get item holder 
    function getItemHolder(uint256 party_item_id) public view onlyManager returns(address payable item_holder) 
    {
        return party_items[party_item_id].holder;
    }
    
    // get item name 
    function getItemName(uint256 party_item_id) public view onlyManager returns(string memory item_name) 
    {
        return party_items[party_item_id].name;
    }
    
    // get item expiration time 
    function getItemExpirationTime(uint256 party_item_id) public view onlyManager returns(uint256 item_expiration_time)
    {
        return party_items[party_item_id].time_expiration;
    }
    
    // get item checked 
    function isItemChecked(uint256 party_item_id) public view onlyManager returns(bool is_item_checked)
    {
        return party_items[party_item_id].checked;
    }
    
    // is item holder 
    function isItemHolder(uint256 party_item_id, address potential_holder) public view onlyManager returns(bool is_item_holder)
    {
        return (getItemHolder(party_item_id) == potential_holder);
    }
    
    // get all party items  - experimental
    function getAllPartyItems() public view onlyManager returns(PartyItem [] memory all_party_items)
    {
        return party_items;
    }
    
    // check and uncheck party item 
    function updatePartyItemCheck(address payable user_address, uint256 party_item_id) public onlyManager 
    {
        // check if user is initiator or holder of the item 
        require((user_address == initiator) || (isItemHolder(party_item_id, user_address)), "User is not allowed to update item info");
        
        // what was previous state of item 
        bool item_state = isItemChecked(party_item_id);
        
        // set new item state
        party_items[party_item_id].checked = !item_state;
        
    }
    
    // delete party item 
    function deletePartyitem(address payable user_address, uint256 party_item_id) public onlyManager
    {
        // todo implement
    }
    
}