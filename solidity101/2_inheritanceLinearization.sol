pragma solidity ^0.6.7;

contract A {
    function x() public virtual pure returns(string memory) {
        return Contract A;
    }
}

contract B {
    function x() public virtual pure returns(string memory) {
        return Contract B;
    }
}

contract Test is B, A {
    function x() public override(A, B) pure returns(string memory) {
        return super.x();
    }
}