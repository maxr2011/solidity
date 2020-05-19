pragma solidity >=0.4.22 <0.7.0;

contract SimpleSet {
    // Mapping from address to position in the array
    // 0 means the address is not in the array
    mapping (address => uint) index;

    // Array with address 
    address[] store;

    constructor() public {
        // We will use position 0 to flag invalid address
        store.push(address(0));
    }

    function addToArray(address who) public {
        if (!inArray(who)) {
            // Append
            index[who] = store.length;
            store.push(who);
        }
    }

    function inArray(address who) public view returns (bool) 
    {
        // address 0x0 is not valid if pos is 0 is not in the array
        return (who != address(0) && index[who] > 0);
    }

    function getPosition(uint pos) public view returns (address) {
        // Position 0 is not valid
        require(pos > 0, "this index is not valid"); 
        return store[pos];
    }
}