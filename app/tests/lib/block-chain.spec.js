const BlockChain = require('../../lib/block-chain');

describe('BlockChain Class', () => {
  let blockChain;
  beforeEach(() => {
    blockChain = new BlockChain();
  });
  it('Should have a genesis block', () => {
    expect(blockChain.chain.length).toBe(1);
  });
  it('Should register a list of nodes', () => {
    const nodes = ['localhost:4040', 'localhost:4041', 'localhost:4042'];
    nodes.forEach(node => {
      blockChain.registerNode(node);
    });
    expect(Array.from(blockChain.nodes).length).toBe(3);
  });
  // it.only('Should create a new hash string from json Object', () => {
  //   const mock = jest.fn();
  //   process.env.HASH_TYPE = '0000'
  //   expect(1 + 1).toBe(2)
  // });
  // it('Should check if proof is valid', () =>{
  //     expect(1 + 1).toBe(3); // Todo
  // });
  // it('Should mine a new block', () => {
  //     expect(1 + 1).toBe(3); // Todo
  // });
  // it('Should resolve conflicts', () => {
  //     expect(1 + 1).toBe(3); // Todo
  // });
  // it('Should show proof of work', () => {
  //     expect(1 + 1).toBe(3); // Todo
  // });
  // it('Should check for a valid chain', () => {
  //     expect(1 + 1).toBe(3); // Todo
  // });
  // it('Should check the validity of a chain', () => {
  //     expect(1 + 1).toBe(3); // Todo
  // });
});
