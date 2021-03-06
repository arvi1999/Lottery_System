pragma solidity ^0.4.17;

contract Lottery {
    address public manager ;
    address[] public players;

    //constructor function
    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);             //convert to wei...
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));   //sha3 is also same thing
    }

    function pickWinner() public restricted {
        //require(msg.sender == manager);
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    // function returnEnteries() {
    //     require(msg.sender == manager);
    // }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayer() public view returns(address[]) {
        return players;
    }
}
