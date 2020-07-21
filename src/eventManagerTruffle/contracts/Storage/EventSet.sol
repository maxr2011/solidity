pragma solidity ^0.6.7;

// import event contract
import "../../contracts/Event.sol" as EventContract;

// EventSet - Store event contracts 
// each element should be only once in this Set
contract EventSet {
    
    // Mapping from address to position in the array
    // 0 means the address is not in the array
    mapping (address => uint) index;
    
    // Mapping from user to its event array
    mapping (address => address[]) user_mapping;

    // Array with address 
    EventContract.Event[] event_store;
    
    // Constructor
    constructor() public 
    {
        // add 0x0 event
        index[address(0)] = 0;
        event_store.push(EventContract.Event(0));
    }

    // add new element to array
    function addToArray(EventContract.Event event_element) public 
    {
        // get event address
        address event_address = address(event_element);
        
        // check for invalid event 
        require(event_address != address(0), "Invalid Event");
        
        // check if already in array 
        require(!inArray(event_address), "Event already in Array");
        
        // append
        index[event_address] = event_store.length;
        event_store.push(event_element);
        
        // add initiator to user mapping 
        address event_initiator = event_element.getInitiator();
        
        // add event to user mapping 
        user_mapping[event_initiator].push(event_address);
        
    }

    // check if element is in array
    function inArray(address event_address) public view returns (bool in_array) 
    {
        
        // event 0x0 is not valid
        return (index[event_address] > 0);
        
    }

    // get position by specific element 
    function getPosition(address event_address) public view returns (uint address_position)
    {
        
        // Address 0x0 is not valid 
        if(event_address == address(0)) return 0;
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
    function getUserEventArray(address payable event_initiator, bool check_participant) public view returns(address [] memory event_array)
    {
        
        if(!check_participant) {
            
            // get events from user mapping 
            return user_mapping[event_initiator];
            
        } else {
        
        
            // create new variable to count user events 
            uint user_event_count = 0;
        
            // loop array to count elements 
            for(uint i = 1; i < event_store.length; i++) {
            
                if(event_store[i].isParticipant(event_initiator)) {
                    
                    user_event_count++;
                    
                }
            
            }
        
        
            // initialize new array with size of the user events 
            event_array = new address [](user_event_count);
        
            // initialize new counter 
            uint k = 0;
        
            // get all elements without the 0x0 event element 
            for(uint j = 0; j < event_store.length-1; j++) {
            
                // set a temporary event element variable 
                EventContract.Event temporaryEvent = event_store[j+1];
            
                // check if user is the initiator of the event
                if(temporaryEvent.isParticipant(event_initiator)) {
                
                    // add event element to output array 
                    event_array[k] = address(temporaryEvent);
                    k++;
                
                }
            
            }
        
            // return array 
            return event_array;
        
        }
        
    }
    
    // remove specific address element 
    function removeFromArray(EventContract.Event event_element, address potential_initiator) public
    {
        
        // get initator 
        address event_initiator = event_element.getInitiator();
        
        // check if initiator 
        require(potential_initiator == event_initiator, "Only Initiator can delete Event");
        
        // get event address
        address event_address = address(event_element);
        
        // check if in array 
        require(inArray(event_address), "Event not in Array");
        
        // move all other elements 
        uint pos = getPosition(event_address);
        
        for (uint i = pos; i < event_store.length-1; i++){
            
            // move next element to current element
            index[address(event_store[i+1])] = index[address(event_store[i])];
            event_store[i] = event_store[i+1];
            
        }
        
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