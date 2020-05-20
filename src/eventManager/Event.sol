pragma solidity ^0.6.7;

import "eventManager/Set.sol" as SetStorage;

// Event contract
contract Event {
    
    // variables
    address             private id;                      // contract address of the event 
    address             payable private initiator;       // owner address of the creator
    SetStorage.Set      private participants;            // owner addresses of participants
    string              private name;                    // name of the event 
    string              private description;             // description of the event 
    string              private location;                // location of the event
    uint256             private time_created;            // when the event was created   - in unix time format
    uint256             private time_start;              // when the event starts        - in unix time format
    uint256             private time_end;                // when the event ends          - in unix time format 
    uint256             private time_expiration;         // when the event expires       - in unix time format 
    
    PartyItem[] public party_items;                     // items to bring with 
    
    // party item 
    struct PartyItem 
    {
        string      name;                                   // name of the item 
        address     holder;                                 // participant who brings the item
        bool        checked;                                // wether the item is already brought or not 
    }
    
    // constructor with required parameters
    constructor(string memory event_name, string memory event_location, uint256 start_time, uint256 end_time) public
    {
        
        // assign variables
        id              = address(this);            // set id to this contract address                         
        initiator       = msg.sender;               // set initiator to sender address 
                                                    // at the time of creation there are 0 participants
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
                    
    }
    
    // getter and setter
    
    // get event info 
    function getInfo() public view 
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
    function getId()                public view returns(address         event_id)               { return id; }                  // returns event id
    function getInitiator()         public view returns(address         event_initiator)        { return initiator; }           // returns event initiator
    function getParticipants()      public view returns(SetStorage.Set  event_participants)     { return participants; }        // returns event participants
    function getName()              public view returns(string memory   event_name)             { return name; }                // returns event name 
    function getDescription()       public view returns(string memory   event_description)      { return description; }         // returns event description
    function getLocation()          public view returns(string memory   event_location)         { return location; }            // returns event location
    function getTimeCreated()       public view returns(uint256         event_time_created)     { return time_created; }        // returns event creation time 
    function getTimeStart()         public view returns(uint256         event_time_start)       { return time_start; }          // returns event start time 
    function getTimeEnd()           public view returns(uint256         event_time_end)         { return time_end; }            // returns event end time 
    function getExpirationTime()    public view returns(uint256         event_time_expiration)  { return time_expiration; }     // returns event time expiration 
    // todo implement - get party items 
    
    
    // attend this event 
    function participate() public
    {
        // check if participant is not the initiator
        require(msg.sender != initiator, "you are already the initiator");
        
        // check if event is not expired 
        require(time_expiration > now, "event is expired");
        
        // add participant address
        participants.addToArray(msg.sender);
    }
    
    // remove participant 
    function removeParticipant(address remove_participant) public {
        // check if sender is initiator
        // only the initiator has permissions to modify event participants
        require(msg.sender == initiator, "only initiator can modify participants list");
        
        // remove participant
        participants.removeFromArray(remove_participant);
    }
    
    // update event name 
    function updateName(string memory new_name) public 
    {
        // check if sender is initiator
        // only the initiator has permissions to modify event name
        require(msg.sender == initiator, "only initiator can modify name");
        
        // set new name 
        name = new_name;
    }
    
    // update event location 
    function updateLocation(string memory new_location) public 
    {
        // check if sender is initiator
        // only the initiator has permissions to modify event location
        require(msg.sender == initiator, "only initiator can modify location");
        
        // set new location 
        location = new_location;
    }
    
    // set the event description
    function setDescription(string memory new_description) public
    {
        // check if sender is initiator
        // only the initiator has permissions to modify event description
        require(msg.sender == initiator, "only initiator can modify description");
        
        // set the new description
        description = new_description;
    }
    
    // set the start time 
    function setStartTime(uint256 time) public
    {
        // check if sender is initiator
        // only the initiator has permissions to modify event start time
        require(msg.sender == initiator, "only initiator can modify start time");
        
        // check if start time is before end time 
        require(time < time_end, "event start time must be before end time");
        
        // set new start time
        time_start = time;
    }
    
    // set the end time
    function setEndTime(uint256 time) public
    {
        // check if sender is initiator
        // only the initiator has permissions to modify event end time
        require(msg.sender == initiator, "only initiator can modify end time");
        
        // check if end time is after start time 
        require(time > time_start, "event end time must be after start time");
        
        // set new end time
        time_end = time;
    }
    
    // set the expiration time 
    // till when can users attend the event 
    function setExpirationTime(uint256 time) public
    {
        // check if sender is initiator
        // only the initiator has permissions to modify event expiration time
        require(msg.sender == initiator, "only initiator can modify expiration time");        
        
        // check if expiration time is before or at start time
        require(time <= time_start, "event expiration time must be before start time");
        
        // set new expiration time 
        time_expiration = time;
    }
    
}