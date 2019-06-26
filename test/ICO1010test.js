const Token1010 = artifacts.require("./Token1010.sol");
const ICO1010 = artifacts.require("./ICO1010.sol");


contract('ICO1010', function(accounts){
  var ICO1010Instance;
  var Token1010Instance;
  var admin = accounts[0];
  var buyer = accounts[1];
  var buyer1 = accounts[2];
  var tokenPrice = 10000;
  var tokensAvailable = 0;
  var _noOfTokens = 10;

  it('should initialize the contract successfully', () => {
    ICO1010.deployed().then(instance => {
      ICO1010Instance = instance;
      return ICO1010Instance.tokenSold();
    }).then(tokenSold => {
      assert.equal(tokenSold,0,'has the correct value for tokenSold');
      return ICO1010Instance.tokenPrice();
    }).then(_tokenPrice => {
      assert.equal(_tokenPrice,tokenPrice,'has the correct value for tokenPrice');
      return ICO1010Instance.admin();
    }).then(_admin => {
      assert.equal(_admin,admin,'has the correct admin');
      return ICO1010Instance.Token1010Contract();
    }).then(_address => {
      assert.notEqual(_address,'0x0','has contact address');
    });
  });

  it('should start sale',() => {
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return ICO1010.deployed();
    }).then(instance => {
      ICO1010Instance = instance;
      let _tokens = 100;
      tokensAvailable += _tokens;
      return ICO1010Instance.startSale(_tokens,{from : admin});
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sale', 'should be the "Sale" event');
      assert.equal(receipt.logs[0].args.active, true, 'logs the whether sale is active or not');
    });
  });

  it('should facilitates token buying',() => {
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return ICO1010.deployed();
    }).then(instance => {
      ICO1010Instance = instance;
      return ICO1010Instance.buyToken(_noOfTokens,{from : buyer, value : _noOfTokens*tokenPrice });
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._to, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._value, _noOfTokens, 'logs the number of tokens purchased');
      return ICO1010Instance.tokenSold();
    }).then(amt => {
      assert.equal(amt.toNumber(),_noOfTokens,'increments the no of token sold');
      return Token1010Instance.balanceOf(buyer);
    }).then(balance => {
      assert.equal(balance.toNumber(),_noOfTokens);
      return Token1010Instance.balanceOf(ICO1010Instance.address);
    }).then(balance => {
      assert.equal(balance.toNumber(), tokensAvailable - _noOfTokens);
      return ICO1010Instance.buyToken.call(_noOfTokens, { from: buyer, value: 1 });
    }).then(result => {
      assert.notEqual(result,true,'should be failure');
    })
  });

/*  it('should facilitates end of sale',() => {
    Token1010.deployed().then(instance => {
      Token1010Instance = instance;
      return ICO1010.deployed();
    }).then(instance => {
      ICO1010Instance = instance;
      return ICO1010Instance.endSale({from : admin});
    }).then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sale', 'should be the "Sale" event');
      assert.equal(receipt.logs[0].args.active, false, 'logs the whether sale is active or not');
    });
  })
*/
});
