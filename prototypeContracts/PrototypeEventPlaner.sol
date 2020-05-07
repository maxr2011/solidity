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
contract ItemToBringWith // funded items, need implementation for free items.
{
    address payable public dudeWhoBringsIt;
    uint public costInWei;
    uint256 public time_expiration;
    mapping (address => uint) public contributions;
    constructor(address payable dude, uint weiNeeded, uint256 time_expire) public
    {
        dudeWhoBringsIt = dude;
        costInWei = weiNeeded;
        time_expiration = time_expire;
    }
    function contribute() payable public
    {
        contributions[msg.sender] += msg.value;
        if(address(this).balance >= costInWei)
        {
            selfdestruct(dudeWhoBringsIt);
        }
    }
    function paybackIfFundingExpired() public
    {
        if(now >= time_expiration)
        {
            msg.sender.transfer(contributions[msg.sender]);
            contributions[msg.sender] = 0;
        }
    }
}

contract Event 
{
    string public name;
    uint256 public time_Start;
    uint256 public time_End;
    uint256 public time_expiration;
    address public initiator;
    SimpleSet public attendants;
    
    PartyItem[] public partyItems;
    
    struct PartyItem       {
        ItemToBringWith item;
        string name;
        address dudeOrDudette;
    }

    constructor(string memory eventName, uint256 start_time, uint256 end_time) public
    {
        name = eventName;
        initiator = msg.sender;
        time_Start = start_time;
        time_End = end_time;
        attendants =  new SimpleSet();
    }

    function changeStartTime(uint256 time) public
    {
        if(msg.sender == initiator) time_Start = time;
    }
    function changeEndTime(uint256 time) public
    {
         if(msg.sender == initiator) time_End = time;
    }
    
    function attendThisEvent() public
    {
        attendants.addToArray(msg.sender);
    }
    
    function proposeItemToBringWith(string memory itemName, uint costInWei) public
    {
        partyItems.push(PartyItem(new ItemToBringWith(msg.sender, costInWei, time_End),itemName,msg.sender));
    }
    
}