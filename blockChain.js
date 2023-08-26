/* let hash = require ('object-hash'); */

class BlockChain {

    constructor() {

        this.chain = [];

        this.pendingVotes = [];

    }

    addNewBlock(prevHash, nonce) {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            votes: this.pendingVotes,
            hash: hash,
            nonce: nonce, 
            prevHash: prevHash,
        };

        this.hash = hash(block);

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
    }

    isEmpty() {
        return this.chain.length == 0;
    }

    lastBlock() {
        return this.chain.slice(-1)[0];
    }

}

module.exports = BlockChain;