const BlockChain = require('./block-chain');
class MwituCoin {
    getExampleMessage() {
        return `Hello, welcome to Mwitu Coin. ` + new BlockChain().hash({hi: 'hi'}).toString();
    }
}

module.exports = MwituCoin;
