let Hash = require ('./hash');
const { v4: uuidv4 } = require('uuid');

let hashedvalue = new Hash();

class BlockChain {

    constructor() {

        this.chain = [];

        this.pendingVotes = [];

        this. networkNodes = [];

        this.nodeUrl = process.argv[3];

        this.addNewBlock("0", 1, "Genesis");
    };

    addNewBlock(prevHash, nonce, hash) {
        let block = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            votes: this.pendingVotes,
            hash: hash,
            nonce: nonce, 
            prevHash: prevHash,
        };

        this.chain.push(block);
        this.pendingVotes = [];

        return block;

    };

    addNewVote(voter, candidate, voteToken) {
        const vote = {
            voter,
            candidate,
            voteToken,
            voteId: uuidv4().split('-').join('')
        };

        return vote;
    };

    addVoteToPendingVotes(vote) {
        this.pendingVotes.push(vote);
        return this.lastBlock()['index'] + 1;
    };

    isEmpty() {
        return this.chain.length == 0;
    };

    lastBlock() {
        return this.chain.at(-1);
    };

    countVotes() {
        const candidateVotes = {};

        this.chain.forEach(block => {
            block.votes.forEach(vote => {
                const candidate = vote.candidate;
                if (!candidateVotes[candidate]) {
                    candidateVotes[candidate] = 1;
                } else {
                    candidateVotes[candidate]++;
                }
            });
        });

        return candidateVotes;
    }
    
}

module.exports = BlockChain;