pragma solidity ^0.6.7;

contract A {
    address private owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function getOwner() public view returns(address) {
        return owner;
    }
    
    function getText() public pure returns(string memory) {
        return "hallo";
    }
    
    function payMe() public payable returns(string memory) {
        return "danke";
    }
    
    function dontPayMe() public {
        
    }  
    
    function whatDoYouHave() public view returns (uint) {
        return address(this).balance;
    }
    
}