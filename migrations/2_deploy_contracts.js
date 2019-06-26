const Token1010 = artifacts.require("./Token1010");
const ICO1010 = artifacts.require("./ICO1010.sol");

module.exports = deployer => {
  deployer.deploy(Token1010).then(() => {
    let tokenPrice = 10000;
    return deployer.deploy(ICO1010, Token1010.address, tokenPrice);
  });
};
