pragma solidity ^0.6.7;

contract A {

    function inMemory() public pure {
        uint[3] memory x = [uint(1),2,3];
        uint[] memory dynamic = new uint[](0);
        dynamic[0] = 3;
        dynamic[1] = 2;
    }
    
    uint[] private myArray;
    function inStorage() public {
        myArray.push(1);
        myArray = new uint[](2);
        myArray = [1, 2];
        
        myArray = new uint[](2);
        myArray[0] = 1;
        myArray[1] = 2;
        // myArray[2] = 3;
        myArray.push(3);
        myArray[2];
        delete myArray[2];
        myArray[2] = 3;
    }
    
    uint[][5] multi;
    function multiple() public returns(uint, uint) {
        multi[0].push(1);
        multi[0].push(2);
        multi[1] = [uint(3), 4, 5];
        return (multi[0][1], multi[1][0]);
    }
    
    uint[5][] dynamic;
    function testDynamic() public {
        uint[5] memory x = [uint(230), 8, 9, 10, 11];
        
        dynamic = new uint[5][](5);
        dynamic[0] = x;
        
        dynamic.push(x);
    }
    
    uint[][] totallyDynamic;
    
    function testTotallyDynamic() public {
        totallyDynamic = new uint[][](2);
        totallyDynamic.push(new uint[](2));
        totallyDynamic[0].push(1);
        totallyDynamic[0].push(1);
        totallyDynamic[0].push(1);
        totallyDynamic.push(new uint[](2));
        totallyDynamic.push(new uint[](2));
   }
    
}