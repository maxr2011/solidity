pragma solidity ^0.6.7;

contract A {
    uint[] private array;
    
    function x(uint[] storage test) internal {
        
    }
    
    function y(uint[] memory test) public {
        
    }
    
    function z() public view returns(uint[] memory) {
        return array;
    }
    
    function zy() internal view returns (uint[] storage) {
        return array;
    }
}