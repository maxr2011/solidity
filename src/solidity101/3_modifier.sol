pragma solidity ^0.6.7;

contract A {
    address private owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Access is only allowed for owner.");
        _;
    }
    
    function x() public onlyOwner view {
        
    }
    
    function y() public pure {
        
    }
}