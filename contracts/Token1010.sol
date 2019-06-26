pragma solidity ^0.5.1;


contract Token1010 {

    string public name = "Token1010";
    string public symbol = "T1010";
    uint public totalSupply = 0;
    address public owner;

    mapping (address => uint) balances;
    mapping (address => mapping(address => uint)) private Allowance;

    event Transfer(address from, address to,uint value);
    event Approval(address sender, address spender, uint value);

    constructor() public {
        owner = msg.sender;
    }

    function balanceOf(address addr) public view returns(uint){
        return balances[addr];
    }

   function mint(uint _noOfTokens) public returns(bool){
       require(tx.origin == owner);
       balances[msg.sender] += _noOfTokens;
       totalSupply = _noOfTokens;
       return true;
   }


    function transfer(address _to, uint _value) public returns(bool){
        require(balances[msg.sender] >= _value);
        require(_to != address(0));
        balances[_to] += _value;
        balances[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to,uint _value) public returns(bool){
        require(balances[_from] >= _value);
        require(Allowance[_from][msg.sender] >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        Allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns(bool){
         require(_spender != address(0));
         require(balances[msg.sender] >= _value);
         Allowance[msg.sender][_spender] += _value;
         emit Approval(msg.sender, _spender, _value);
         return true;
    }

    function allowance(address _owner, address _spender) public view returns(uint){
        return Allowance[_owner][_spender];
    }
}
