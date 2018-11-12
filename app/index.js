const express = require('express');
const bodyParser = require('body-parser');
const uuid4 = require('uuid4')
// const MwituCoin = require('./lib/mwitu-coin');
const BlockChain = require('./lib/block-chain');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = 4040;

// const mwituCoin = new MwituCoin();
const nodeIdentifier = uuid4().replace('-', '');
const blockChain = new BlockChain();

// app.get('/', (req, res) => res.send(mwituCoin.getExampleMessage()));

// get chain
app.get('/chain', (req, res) => {
  res.send({
    chain: blockChain.chain,
    length: blockChain.chain.length,
  })
});

// get nodes
app.get('/nodes', (req, res) => {
  res.send({
    nodes: Array.from(blockChain.nodes),
  })
});

// register nodes
app.post('/nodes/register', (req, res) => {
  console.log(req.body);
  const nodes = req.body.nodes || [];
  nodes.forEach(node => {
    blockChain.registerNode(node);
  });
  res.send({
    message: nodes.length > 1 ? 'New Nodes have been added' : 'New node has been added',
    nodes: Array.from(blockChain.nodes),
  });
});

// resolve conflicts
app.get('/nodes/resolve', async (req, res) => {
  const replace = blockChain.resolveConflicts();
  res.send(replace ? {
    message: 'Our chain was replaced',
    newChain: blockChain.chain,
  } : {
    message: 'Our chain is authoritative',
    chain: blockChain.chain,
  });
});

// mine
app.get('/mine', (req, res) => {
  // we run the proof of work algorithm to get the next proof..
  const lastBlock = blockChain.lastBlock();
  const lastProof = lastBlock.proof;
  const proof = blockChain.proofOfWork(lastProof);
  // Recieve a reward for finding the proof
  // denote sender as "0" to signify that this node has mined a new coin.
  blockChain.newTransaction(0, nodeIdentifier, 1);
  const previousHash = blockChain.hash(lastBlock);
  const block = blockChain.newBlock(proof, previousHash);
  res.send({
    message: 'New Block forged',
    index: block.index,
    transaction: block.transactions,
    proof: block.proof,
    previousHash: block.previousHash
  });
});



// Todo headless endpoints i.e self execting

app.listen(port, () => console.log(`App running on port: ${port}`));