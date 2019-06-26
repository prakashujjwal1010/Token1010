const Token1010 = artifacts.require("./Token1010.sol");


contract('Token1010',accounts => {
  var Token1010Instance;
  var owner = accounts[0];
  var buyer1 = accounts[2];
  var buyer = accounts[3];


  it('should initialize the contract successfully', () => {
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return Token1010Instance.name();
    }).then(name => {
      assert.equal(name,'Token1010','has the correct name');
      return Token1010Instance.symbol();
    }).then(symbol => {
      assert.equal(symbol,'T1010','has the correct symbol');
      return Token1010Instance.owner();
    }).then(_owner => {
      assert.equal(_owner,owner,'has the correct owner');
    });
  });

  it('should call balanceOf successfully',()=>{
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return Token1010Instance.balanceOf(buyer);
    }).then(balance => {
      assert.equal(balance.toNumber(),0,'success');
    });
  });

  it('should mint tokens successfully by calling mint()',()=>{
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return Token1010Instance.mint(15000,{from : owner});
    }).then(result => {
      return Token1010Instance.mint.call(15000,{from : buyer});
    }).then(result => {
      //assert.equal(result,false,'should be failure');
    });
  });


  it('should transfer ownership by calling transfer()',()=>{
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return Token1010Instance.transfer.call(buyer,20,{from : owner});
    }).then(result => {
      assert.equal(result,true,'success');
      return Token1010Instance.transfer.call(buyer,9999999999999,{from : owner});
    }).then(result => {
      assert.equal(result,false,'should be failure');
      return Token1010Instance.transfer(buyer,20,{from : owner});
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, owner, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, buyer, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 20, 'logs the transfer amount');

      return Token1010Instance.balanceOf(buyer);
    }).then(balance => {
      assert.equal(balance.toNumber(), 20, 'adds the amount to the receiving account');
    });
  });

  it('should approve tokens for delegated transfer by callinng approve()',()=>{
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return Token1010Instance.approve.call(buyer1,50);
    }).then(result => {
      assert.equal(result, true,'success');
      return Token1010Instance.approve(buyer1,100,{from : owner});
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
      assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
      assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
      assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
      return tokenInstance.allowance(accounts[0], accounts[1]);
    }).then(allownce => {
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
    })
  });


  it('should transfer ownership by calling transferFrom()',()=>{
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return Token1010Instance.transferFrom.call(buyer,20);
    }).then(result => {
      assert.equal(result,true,'success');
      return Token1010Instance.transfer.call(buyer,9999999999999);
    }).then(result => {
      assert.equal(result,false,'should be failure');
      return Token1010Instance.transfer(buyer,20,{from : owner});
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, owner, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, buyer, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 20, 'logs the transfer amount');

      return Token1010Instance.balanceOf(buyer);
    }).then(balance => {
      assert.equal(balance.toNumber(), 20, 'adds the amount to the receiving account');
    });
  });

});
