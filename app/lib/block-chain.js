const crypto = require('crypto');
const axios = require('axios');
const url = require('url');
class BlockChain {
  constructor() {
    this.chain = [];
    this.currentTransactions = [];
    this.nodes = new Set();
    
    // bindings
    this.hash = this.hash.bind(this);
    this.lastBlock = this.lastBlock.bind(this);
    this.newBlock = this.newBlock.bind(this);
    this.newTransaction = this.newTransaction.bind(this);
    this.proofOfWork = this.proofOfWork.bind(this);
    this.validChain = this.validChain.bind(this);
    this.validProof = this.validProof.bind(this);
    this.resolveConflicts = this.resolveConflicts.bind(this);

    // create genesis block
    this.newBlock(100, 1);
  }

  hash(block) {
    const blockString = JSON.stringify(block);
    const hash = crypto.createHash(process.env.HASH_TYPE).update(`${lastProof}${proof}`).digest('hex');
    // const hash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
    //   .update(blockString).digest('hex');
    return hash;
  }
/**
 * Get last block in our chain
 * @return {object}
 */
  lastBlock() {
    return this.chain.slice(-1)[0];
  }

  newBlock(proof, previousHash) {
    const block = {
      index: this.chain.length + 1,
      timestamp: new Date(),
      transactions: this.currentTransactions,
      proof,
      previousHash,
    }
    this.currentTransactions = [];
    this.chain.push(block);
    return block;
  }

  newTransaction(sender, receipent, amount) {
    this.currentTransactions.push({
      sender, receipent, amount
    });
    this.lastBlock()['index'] + 1;
  }

  proofOfWork(lastProof) {
    let proof = 0;
    while (!this.validProof(lastProof, proof)) {
        proof++;
    }
    return proof;
  }
/**
 * Add a new node to the list of nodes
 * @param {string} address
 * 
 */
  registerNode(address) {
    const nodeUrl = url.parse(address);
    this.nodes.add(nodeUrl)
  }

  /**
   * Consensus algorithm, it resolves conflicts by replacing our chain with the
   * longest one in the network.
   * @returns {boolean} true if our chain was replaced false if chain isn't replaced
   */
  async resolveConflicts() {
    const nodes = this.nodes;
    let newChain;
    let maxLength = this.chain.length;
    for (const node of nodes) {
      try {
        const res = await axios.get(`http://${node.href}/chain`);
        const data = res.data;
        const chainLen = data.length;
        const chain = data.chain;
        if (chainLen > maxLength && this.validChain(chain)) {
          maxLength = chainLen;
          newChain = chain;
        }
      } catch (err) {
        console.log(err);
      }
    }
    // replace our chain if new, valid and longer chain is available
    if (newChain) {
      this.chain = newChain;
      return true;
    }
    return false;
  }

  validProof(lastProof, proof) {
    const guessHash =  crypto.createHash(process.env.HASH_TYPE).update(`${lastProof}${proof}`).digest('hex');
    // const guessHash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
    //   .update(`${lastProof}${proof}`)
    //   .digest('hex');
    return guessHash.substr(0, 5) === process.env.RESOLUTION_HASH;
  }

  /**
   * Determines if a given blockchain is valid
   * @param {array} chain 
   * @returns {boolean} true if valid , false is not valid
   */
  validChain(chain) {
    let lastBlock = chain[0];
    let currentIndex = 1;

    while (currentIndex < chain.length - 1) {
      const block = chain[currentIndex];
      console.log(lastBlock);
      console.log(block);
      console.log('---------------------------');
      // check if the hash of the block is correct and 
      if (block.previousHash !== this.hash(lastBlock) || this.validProof(lastBlock.proof, block.proof) === false) {
        return false;
      }
      lastBlock = block;
      currentIndex++;
    }
    return true;
  }
}

module.exports = BlockChain;
