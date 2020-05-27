pragma solidity ^0.6.7;

// import event contract
import "eventManager/Event.sol" as EventContract;

// EventSet - Store event contracts 
// each element should be only once in this Set
contract EventSet {
    
    // Mapping from address to position in the array
    // 0 means the address is not in the array
    mapping (EventContract.Event => uint) index;
    
    // Mapping from user to its event array
    mapping (address => EventContract.Event[]) user_mapping;

    // Array with address 
    EventContract.Event[] event_store;
    
    // Constructor
    constructor() public 
    {
        
        // building 0x0 event 
        address     payable     zrx_event_address       = address(0);                                   // event address: 0x0
        string      memory      zrx_event_name          = "0xEvent";                                    // event name 
        string      memory      zrx_event_location      = "0xLocation";                                 // event location 
        uint256                 zrx_five_min_time       = 5 * 60 * 1000;                                // 5 min timeframe 
        uint256                 zrx_event_time_start    = now + zrx_five_min_time;                      // start time five minutes from now 
        uint256                 zrx_event_time_end      = zrx_event_time_start + zrx_five_min_time;     // end time five minutes after start time 
        
        // adding 0x0 event to array
        addToArray(
            new EventContract.Event(
                zrx_event_address, 
                zrx_event_name, 
                zrx_event_location,
                zrx_event_time_start,
                zrx_event_time_end
            )
        );
        
    }

    // add new element to array
    function addToArray(EventContract.Event event_element) public 
    {
        
        // check for invalid event 
        require(address(event_element) != address(0), "Invalid Event");
        
        // check if already in array 
        require(!inArray(event_element), "Event already in Array");
        
        // append
        index[event_element] = event_store.length;
        event_store.push(event_element);
        
        // add initiator to user mapping 
        address event_initiator = event_element.getInitiator();
        
        // add event to user mapping 
        user_mapping[event_initiator].push(event_element);
        
    }

    // check if element is in array
    function inArray(EventContract.Event event_address) public view returns (bool in_array) 
    {
        
        // event 0x0 is not valid
        return (index[event_address] > 0);
        
    }

    // get position by specific element 
    function getPosition(EventContract.Event event_address) public view returns (uint address_position)
    {
        
        // Address 0x0 is not valid 
        if(address(event_address) == address(0)) return 0;
        return index[event_address];
        
    }

    // get specific element by position
    function getByPosition(uint pos) public view returns (EventContract.Event event_element) 
    {
        
        // Position 0 is not valid
        require(pos > 0, "this index is not valid"); 
        
        // Check if pos is higher than store size 
        require(pos < event_store.length, "out of bounds");
        
        return event_store[pos];
        
    }
    
    // get element count 
    function getElementCount() public view returns(uint element_count) 
    {
        
        // Return Array size (minus the 0x0 event)
        return event_store.length - 1;
        
    }
    
    // get whole array 
    function getEventArray() public view returns(EventContract.Event[] memory event_array) 
    {
        
        // initialize new array with size - 0x0 event element 
        event_array = new EventContract.Event [](event_store.length-1);
        
        // get all elements without the 0x0 event element 
        for(uint i = 0; i < event_store.length-1; i++) {
            
            // add event element to output array 
            event_array[i] = event_store[i+1];
            
        }
        
        // return array 
        return event_array;
    
    }
    
    // get user specific array - own events or participating events
    function getUserEventArray(address payable event_initiator, bool check_participant) public view returns(EventContract.Event[] memory event_array)
    {
        
        if(!check_participant) {
            
            // get events from user mapping 
            return user_mapping[event_initiator];
            
        } else {
        
        
            // create new variable to count user events 
            uint user_event_count = 0;
        
            // loop array to count elements 
            for(uint i = 0; i < event_store.length; i++) {
            
                // skip 0x0 event element 
                if(i > 0) {
                
                    EventContract.Event temporary_event = event_store[i];
                
                    if(temporary_event.isParticipant(event_initiator)) {
                    
                        user_event_count++;
                    
                    }
                
                }
            
            }
        
        
            // initialize new array with size of the user events 
            event_array = new EventContract.Event [](user_event_count);
        
            // initialize new counter 
            uint k = 0;
        
            // get all elements without the 0x0 event element 
            for(uint j = 0; j < event_store.length-1; j++) {
            
                // set a temporary event element variable 
                EventContract.Event temporaryEvent = event_store[j+1];
            
                // check if user is the initiator of the event
                if(temporaryEvent.isParticipant(event_initiator)) {
                
                    // add event element to output array 
                    event_array[k] = temporaryEvent;
                    k++;
                
                }
            
            }
        
            // return array 
            return event_array;
        
        }
        
    }
    
    // remove specific address element 
    function removeFromArray(EventContract.Event event_address) public
    {
        
        // check if in array 
        require(inArray(event_address), "Event not in Array");
        
        // move all other elements 
        uint pos = getPosition(event_address);
        
        for (uint i = pos; i < event_store.length-1; i++){
            
            // move next element to current element
            index[event_store[i+1]] = index[event_store[i]];
            event_store[i] = event_store[i+1];
            
        }
        
        // get initator 
        address event_initiator = event_address.getInitiator();
        
        // Remove the last element of the array
        delete index[event_address];
        event_store.pop();
        
        // Remove from user mapping 
        
        // new variable for event position in mapping 
        uint event_pos = 0;
        
        // move positions 
        for(uint j = 0; j < user_mapping[event_initiator].length; j++) {
            
            if(user_mapping[event_initiator][j] == event_address) {
                event_pos = j;
            }
            
        }
        
        for(uint l = event_pos; l < user_mapping[event_initiator].length-1; l++) {
            
            user_mapping[event_initiator][l] = user_mapping[event_initiator][l+1];
            
        }
        
        // pop last element 
        user_mapping[event_initiator].pop();
        
    }
    
}