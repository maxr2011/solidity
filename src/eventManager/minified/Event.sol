pragma solidity^0.6.7;pragma experimental ABIEncoderV2;import"eventManager/Storage/Set.sol"as SetStorage;contract Event{address private id;address payable private manager;address payable private initiator;SetStorage.Set private participants;string private name;string private description;string private location;uint256 private time_created;uint256 private time_start;uint256 private time_end;uint256 private time_expiration;modifier onlyManager{require(msg.sender==manager,"Access is only allowed for manager.");_;} PartyItem[]private party_items;struct PartyItem {uint256 id;address payable holder;string name;uint256 time_expiration;bool checked;} constructor(address payable event_creator,string memory event_name,string memory event_location,uint256 start_time,uint256 end_time)public {id=address(this);initiator=event_creator;manager=msg.sender;name=event_name;location=event_location;time_created=now;time_start=start_time;time_end=end_time;time_expiration=start_time;participants=new SetStorage.Set();require(time_start<time_end,"event start time must be before end time");require(time_start>now,"event start time must be in the future");} function getInfo()public view returns(address event_id,address event_initiator,string memory event_name,string memory event_location,uint256 event_start_time,uint256 event_end_time,uint256 event_created_time,SetStorage.Set event_participants) {return(id,initiator,name,location,time_start,time_end,time_created,participants);} function getId()public view returns(address event_id){return id;} function getInitiator()public view returns(address event_initiator){return initiator;} function getParticipants()public view returns(SetStorage.Set event_participants){return participants;} function getName()public view returns(string memory event_name){return name;} function getDescription()public view returns(string memory event_description){return description;} function getLocation()public view returns(string memory event_location){return location;} function getTimeCreated()public view returns(uint256 event_time_created){return time_created;} function getTimeStart()public view returns(uint256 event_time_start){return time_start;} function getTimeEnd()public view returns(uint256 event_time_end){return time_end;} function getExpirationTime()public view returns(uint256 event_time_expiration){return time_expiration;} function getManager()public view onlyManager returns(address event_manager){return manager;} function participate(address payable participant)public onlyManager {require(participant!=initiator,"you are already the initiator");require(time_expiration>now,"event is expired");participants.addToArray(participant);} function getParticipantsArray()public view returns(address[]memory event_participants) {return participants.getArray();} function removeParticipant(address remove_participant)public onlyManager {participants.removeFromArray(remove_participant);} function updateName(string memory new_name)public onlyManager {name=new_name;} function updateLocation(string memory new_location)public onlyManager {location=new_location;} function setDescription(string memory new_description)public onlyManager {description=new_description;} function setStartTime(uint256 time)public onlyManager {require(time<time_end,"event start time must be before end time");time_start=time;} function setEndTime(uint256 time)public onlyManager {require(time>time_start,"event end time must be after start time");time_end=time;} function setExpirationTime(uint256 time)public onlyManager {require(time<=time_start,"event expiration time must be before start time");time_expiration=time;} function isInitiator(address payable user)public view returns(bool is_initiator) {return(user==initiator);} function isParticipant(address payable user)public view returns(bool is_participant) {return participants.inArray(user);} function proposeItemToBringWith(address payable user_address,string memory item_name)public onlyManager {require((user_address==initiator)||(isParticipant(user_address)),"User is not participant");uint256 party_item_id=getItemCount();party_items.push(PartyItem(party_item_id,user_address,item_name,time_expiration,false));} function getItemCount()public view onlyManager returns(uint256 item_count) {return party_items.length;} function getItemInfo(uint256 party_item_id)public view onlyManager returns(uint256 item_id,address payable item_holder,string memory item_name,uint256 item_time_expiration,bool item_checked) {require(itemExists(party_item_id),"Item does not exist");return(party_items[party_item_id].id,party_items[party_item_id].holder,party_items[party_item_id].name,party_items[party_item_id].time_expiration,party_items[party_item_id].checked);} function itemExists(uint256 party_item_id)public view onlyManager returns(bool item_exists) {return(party_item_id>=0&&party_item_id<getItemCount());} function getItemHolder(uint256 party_item_id)public view onlyManager returns(address payable item_holder) {return party_items[party_item_id].holder;} function getItemName(uint256 party_item_id)public view onlyManager returns(string memory item_name) {return party_items[party_item_id].name;} function getItemExpirationTime(uint256 party_item_id)public view onlyManager returns(uint256 item_expiration_time) {return party_items[party_item_id].time_expiration;} function isItemChecked(uint256 party_item_id)public view onlyManager returns(bool is_item_checked) {return party_items[party_item_id].checked;} function isItemHolder(uint256 party_item_id,address potential_holder)public view onlyManager returns(bool is_item_holder) {return(getItemHolder(party_item_id)==potential_holder);} function getAllPartyItems()public view onlyManager returns(PartyItem[]memory all_party_items) {return party_items;} function updatePartyItemCheck(address payable user_address,uint256 party_item_id)public onlyManager {require((user_address==initiator)||(isItemHolder(party_item_id,user_address)),"User is not allowed to update item info");require(itemExists(party_item_id),"Item does not exist");bool item_state=isItemChecked(party_item_id);party_items[party_item_id].checked=!item_state;} function deletePartyItem(address payable user_address,uint256 party_item_id)public onlyManager {require((user_address==initiator)||(isItemHolder(party_item_id,user_address)),"User is not allowed to update item info");require(itemExists(party_item_id),"Item does not exist");delete party_items[party_item_id];for(uint i=party_item_id;i<party_items.length-1;i++){party_items[i]=party_items[i+1];} party_items.pop();}}