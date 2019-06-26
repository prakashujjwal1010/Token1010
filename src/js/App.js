App = {
  web3Provider : null,
  contracts : {},
  account : '0x0',
  tokenPrice : 100,
  tokenSold : 0,
  tokensAvailable : 0,

  init : async function() {
    console.log("app initialized");
    return await App.initWeb3();
  },

  initWeb3 : async function() {
    //modern dapp browsers or metamask injects ethereum provider
   if(window.ethereum){
      App.web3Provider = window.ethereum;
      try {
        //request account access
        await window.ethereum.enable();
      } catch (e) {
        console.log('iser denied access to Accounts');
      }
    }
    else if(window.web3){
      App.web3Provider = window.web3.currentProvider;
    }
    else{
      App.web3Provider = new Web3.providers.HttpProviders('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);
    return App.initContract();
  }
,
  initContract : function () {
    $.getJSON("ICO1010.json", function(data) {
      App.contracts.ICO1010Contract = TruffleContract(data);
      //setting provider
      App.contracts.ICO1010Contract.setProvider(App.web3Provider);

    }).done(() => {
      $.getJSON("Token1010.json", function(data) {
        App.contracts.Token1010Contract = TruffleContract(data);

        App.contracts.Token1010.setProvider(App.web3web3Provider);
      });
    });
    App.listenEvents();
    App.loadAccount();
    App.loadAccount();
    return App.bindEvents();
  },

  listenEvents : function () {
    App.contracts.ICO1010Contract.deployed().then(instance => {
      let SellEvent = instance.Sell();
      SellEvent.watch((e,result) => {
        if(!e){
          console.log(result);
        }
        else{
          console.log(e);
        }
      });
    });
  },

  loadAccount : function () {
    //loading ACCOUNT
    web3.eth.getAccounts((error, accounts) => {
      if(error){
        console.log(error);
      }
      else{
        App.account = accounts[0];
      }
    });
  },

  loadBalance : function () {
    App.contracts.Token1010Contract.deployed().then(instance => {
      return instance.balanceOf(App.account);
    }).then(balance => {
      $('#ac').html(balance.toNumber());
    });
  },

  bindEvents : function () {
      $('#start').on('click',function(){
        App.startSale();
      });

      $('#end').on('click',function(){
        App.endSale();
      });

      $('#buy').on('click',function(){
        App.buyTokens();
      });

  },


  startSale : function () {
      let noOfTokens = $('#initial').val()
      App.contracts.ICO1010Contract.deployed().then(instance => {
        return instance.startSale(noOfTokens, {
          from : App.account,
          gas : 500000
        });
      });
  },

  endSale : function () {
    App.contracts.ICO1010Contract.deployed().then(instance => {
      return instance.endSale({
        from : App.account,
        gas : 500000
      });
    });
  },

  buyTokens : function () {
    let noOfTokens = $('#noOfTokens').val()
    App.contracts.ICO1010Contract.deployed().then(instance => {
      return instance.startSale(noOfTokens, {
        from : App.account,
        value : noOfTokens*App.tokenPrice,
        gas : 500000
      });
    });
  }


}
$(function() {
  $(window).on('load',function() {
    App.init();
  })
});
