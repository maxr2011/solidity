pragma solidity ^0.6.7;

struct Voter {
    address voter;
    bool accepted;
}

contract A {

    Voter[] private voters;
    
    function useStruct() public returns(bool) {
        
        Voter memory voter = Voter(msg.sender, false);
        voter.accepted = true;
        voters.push(voter);
        return voters[0].accepted;
        
    }
    
}