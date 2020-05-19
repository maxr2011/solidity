pragma solidity ^0.6.7;

// Set - Store elements
// each element should be only once in this Set
contract Set {
    
    // Mapping from address to position in the array
    // 0 means the address is not in the array
    mapping (address => uint) index;

    // Array with address 
    address[] store;

    // Constructor
    constructor() public {
        
        // We will use position 0 to flag invalid address
        store.push(address(0));
        
    }

    // add new element to array
    function addToArray(address element) public 
    {
        
        // check for invalid address 0x0
        require (element != address(0));
        
        // check if already in array 
        if (!inArray(element)) {
            
            // append
            index[element] = store.length;
            store.push(element);
            
        }
        
    }

    // check if element is in array
    function inArray(address element) public view returns (bool in_array) 
    {
        
        // address 0x0 is not valid if pos is 0 is not in the array
        return (index[element] > 0);
        
    }

    // get position by specific element 
    function getPosition(address element) public view returns (uint address_position)
    {
        
        // Address 0x0 is not valid 
        require (element != address(0));
        return index[element];
        
    }

    // get specific element by position
    function getByPosition(uint pos) public view returns (address result_address) 
    {
        
        // Position 0 is not valid
        require (pos > 0, "this index is not valid"); 
        return store[pos];
        
    }
    
    // get element count 
    function getElementCount() public view returns(uint element_count) 
    {
        
        // Return Array size (minus the 0x0 address element)
        return store.length - 1;
        
    }
    
    // remove specific address element 
    function removeFromArray(address element) public
    {
        
        // move all other elements 
        uint pos = getPosition(element);
        
        for (uint i = pos; i < store.length-1; i++){
            
            // move next element to current element
            index[store[i+1]] = index[store[i]];
            store[i] = store[i+1];
            
        }
        
        // Remove the last element of the array
        delete index[element];
        store.pop();
        
    }
    
}