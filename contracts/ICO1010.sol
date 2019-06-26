pragma solidity ^0.5.1;
import "./Token1010.sol";

contract  ICO1010{

    address public admin;
    uint public tokenPrice;
    uint public tokenSold=0;

    Token1010 public Token1010Contract;

    event Sell(address _to, uint _value);
    event Sale(bool active);

    constructor(Token1010 _Token1010Address, uint _tokenPrice) public payable{
        admin = msg.sender;
        tokenPrice = _tokenPrice;
        Token1010Contract =_Token1010Address;
    }

    function startSale(uint _noOfTokens) public{
        require(Token1010Contract.mint(_noOfTokens));
        emit Sale(true);
    }


    function buyToken(uint _noOfTokens) public payable returns(bool){
        require(msg.value == _noOfTokens*tokenPrice);
        require(Token1010Contract.balanceOf(address(this)) >= _noOfTokens);
        require(Token1010Contract.transfer(msg.sender,_noOfTokens));

        tokenSold += _noOfTokens;
        emit Sell(msg.sender,_noOfTokens);
        return true;
    }

    function endSale() public payable returns(bool){
        require(msg.sender == admin);
        require(Token1010Contract.transfer(admin,Token1010Contract.balanceOf(address(this))));

        msg.sender.transfer(address(this).balance);

        emit Sale(false);
        return true;
    }

}
