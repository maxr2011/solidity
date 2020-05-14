pragma solidity ^0.6.7;

contract A {

    mapping(address => uint) public balances;
    address[] private keys;
    
    function update(uint newBalance) public {
        balances[msg.sender] = newBalance;
        keys.push(msg.sender);
    }
    
    function getBalances(address x) public view returns(uint) {
        return balances[x];
    }
    
    function iterate() public view {
        for(uint i = 0; i < keys.length; i++) 
        {
            balances[keys[i]];
        }
    }
    
}