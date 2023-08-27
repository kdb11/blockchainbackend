let Hash = require ('./hash');

let hashedvalue = new Hash();

class BlockChain {

    constructor() {

        this.chain = [];

        this.pendingVotes = [];

        this. networkNodes = [];

        this.nodeUrl = process.argv[1];

        this.addNewBlock("Genesis", 1, "Genesis");
    }

    addNewBlock(prevHash, nonce, hash) {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            votes: this.pendingVotes,
            hash: hash,
            nonce: nonce, 
            prevHash: prevHash,
        };

        /* this.hash = hashedvalue.createHash(block.prevHash, block.votes, block.nonce); */

        this.chain.push(block);
        this.pendingVotes = [];

        return block;

    }

    addNewVote(voter, candidate, voteToken) {
        const vote = {
            voter,
            candidate,
            voteToken
        }

        this.pendingVotes.push(vote);
        return this.lastBlock()['index'] + 1;
    }

    isEmpty() {
        return this.chain.length == 0;
    }

    lastBlock() {
        return this.chain.slice(-1)[0];
    }

}

module.exports = BlockChain;