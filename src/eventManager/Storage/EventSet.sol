pragma solidity ^0.6.7;

// import event contract
import "eventManager/Event.sol" as EventContract;

// EventSet - Store event contracts 
// each element should be only once in this Set
contract EventSet {
    
    // Mapping from address to position in the array
    // 0 means the address is not in the array
    mapping (address => uint) index;

    // Array with address 
    EventContract.Event[] event_store;

    // Constructor
    constructor() public {
        
    }

    // add new element to array
    function addToArray(EventContract.Event event_element) public 
    {
        
        // check if already in array 
        require(!inArray(address(event_element)), "Event already in Array");
        
        // append
        index[address(event_element)] = event_store.length;
        event_store.push(event_element);
        
    }

    // check if element is in array
    function inArray(address event_address) public view returns (bool in_array) 
    {
        
        // address 0x0 is not valid if pos is 0 is not in the array
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
        
        // Return Array size (minus the 0x0 address element)
        return event_store.length - 1;
        
    }
    
    // remove specific address element 
    function removeFromArray(address event_address) public
    {
        // check if in array 
        require(inArray(event_address), "Address not in Array");
        
        // move all other elements 
        uint pos = getPosition(event_address);
        
        for (uint i = pos; i < event_store.length-1; i++){
            
            // move next element to current element
            index[address(event_store[i+1])] = index[address(event_store[i])];
            event_store[i] = event_store[i+1];
            
        }
        
        // Remove the last element of the array
        delete index[address(event_address)];
        event_store.pop();
        
    }
    
}