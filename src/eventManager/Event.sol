pragma solidity ^0.6.7;

import "eventManager/Set.sol" as SetStorage;

// Event contract
contract Event {
    
    // variables
    address             public id;                      // contract address of the event 
    address             payable public initiator;       // owner address of the creator
    SetStorage.Set      public participants;            // owner addresses of participants
    string              public name;                    // name of the event 
    string              public description;             // description of the event 
    string              public location;                // location of the event
    uint256             public time_created;            // when the event was created   - in unix time format
    uint256             public time_start;              // when the event starts        - in unix time format
    uint256             public time_end;                // when the event ends          - in unix time format 
    uint256             public time_expiration;         // when the event expires       - in unix time format 
    
    PartyItem[] public party_items;                     // items to bring with 
    
    // party item 
    struct PartyItem 
    {
        string name;                                    // name of the item 
        address holder;                                 // participant who brings the item
        // todo complete item logic
    }
    
    // constructor with required parameters
    constructor(string memory event_name, string memory event_location, uint256 start_time, uint256 end_time) public
    {
        id              = address(this);            // set id to this contract address                         
        initiator       = msg.sender;               // set initiator to sender address 
                                                    // at the time of creation there are 0 participants
        name            = event_name;               // set event name
                                                    // description is optional 
        location        = event_location;           // set event location
        time_created    = now;                      // set created time to now
        time_start      = start_time;               // set start time 
        time_end        = end_time;                 // set end time
                                                    // expiration time is optional 
        participants    = new SetStorage.Set();     // create Set for participants 
                                                    // at the time of creation there are 0 party items
    }
    
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
    
    // attend this event 
    function participate() public
    {
        // check if participant is initiator
        require(msg.sender != initiator);
        
        // add participant address
        participants.addToArray(msg.sender);
    }
    
    // change the start time 
    function changeStartTime(uint256 time) public
    {
        // set new start time
        if(msg.sender == initiator) time_start = time;
    }
    
    // change the end time
    function changeEndTime(uint256 time) public
    {
        // set new end time
        if(msg.sender == initiator) time_end = time;
    }
    
}