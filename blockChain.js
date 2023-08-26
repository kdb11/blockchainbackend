let hash = require ('object-hash');

class BlockChain {

    constructor() {

        this.chain = [];

        this.currerntTransactions = [];

    }

    addNewBlock(prevHash) {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.currerntTransactions,
            /* hash: null, */ 
            prevHash: prevHash,
        };

        this.hash = hash(block);

        this.chain.push(block);
        this.currerntTransactions = [];
        return block;

    }

    addNewTransaction(sender, recipient, amount) {
        this.currerntTransactions.push({ sender, recipient, amount })
    }

    isEmpty() {
        return this.chain.length == 0;
    }

    lastBlock() {
        return this.chain.slice(-1)[0];
    }

}

module.exports = BlockChain;