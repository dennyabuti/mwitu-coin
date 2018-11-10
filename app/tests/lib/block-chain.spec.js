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
        expect(1 + 1).toBe(3); // Todo
    });
    it('Should check if proof is valid', () =>{
        expect(1 + 1).toBe(3); // Todo
    });
    it('Should mine a new block', () => {
        expect(1 + 1).toBe(3); // Todo
    });
    it('Should resolve conflicts', () => {
        expect(1 + 1).toBe(3); // Todo
    });
    it('Should show proof of work', () => {
        expect(1 + 1).toBe(3); // Todo
    });
    it('Should check for a valid chain', () => {
        expect(1 + 1).toBe(3); // Todo
    });
    it('Should check the validity of a chain', () => {
        expect(1 + 1).toBe(3); // Todo
    })
});

