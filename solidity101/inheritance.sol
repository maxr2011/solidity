pragma solidity ^0.6.7;

contract A {
    function x() public virtual {
        
    }
    
    function y() public virtual {
        
    }
    
    function z() public virtual {
        
    }
}

contract B is A {
    function y() public virtual override {
        
    }
    
    function z() public virtual override {
        
    }
}

contract C is B {
    function y() public override {
        
    }
}

contract D {
    function x() public virtual {
        
    }
    
    function y() public virtual {
        
    }
    
    function z() public virtual {
        
    }
}

contract Test is B, D {
    
    function x() public override(A, D) {
        
    }
    
    function y() public override(B, D) {
        
    }
    
    function z() public override(B, D) {
        
    }
    
}