pragma solidity ^0.6.7;

contract A {
    function x1() public pure returns(uint) {
        return 4;
    }
    
    function x2() public pure returns(uint result) {
        result = 4;
    }
    
    function x3() public pure returns(uint result) {
        return 4;
    }
    
    function y() public pure returns(uint a, uint b) {
        a = 4;
        b = 2;
    }
    
    function y1() public pure returns(uint a, uint) {
        a = 4;
        return (a, 5);
    }
    
    function z() public pure returns (uint) {
        (, uint m) = y1();
        return m;
    }
    
}