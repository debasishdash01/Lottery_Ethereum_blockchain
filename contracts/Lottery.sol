pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    
    //Syntax: type of variable[] public variable; 
    address[] public players;
        modifier onlyManager() {
        require(msg.sender == manager);
        _; //Underscore is used as a placeholder. 
        }

    function Lottery() public {
    manager = msg.sender;
    }

 //Whenever we are expecting some ether, we have to mark the function as payable
    function enter() public payable{
    require(msg.value > 0.1 ether); 
    //To get address of the players
    players.push(msg.sender);
}
    function random() private view returns (uint) {
    //keccak is a global function, we don't write any import statements
    return uint(keccak256(block.difficulty,now,players));
    //uint because we need to convert the hash to uint type
    }
    
    function pickWinner() public onlyManager {
        // Comment the line as we have a modifier 
       // require(msg.sender == manager);
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        //Create a dynamic array with initial size zero i.e no address initialized
        players = new address[](0);
       
        //players = new address[](2); [0x00000, 0x00000] These are zero addresses.
    }
    function getAllPlayers() public view returns (address[]) {
        return players;
        }
}