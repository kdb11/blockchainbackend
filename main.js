let BlockChain = require("./blockChain");

let voteChain = new BlockChain();

let Hash = require ('./hash');

let hash = new Hash();

let ProofOfWork = require ('./proofOfWork');

let proofOfWork = new ProofOfWork();

let ValidateChain = require ('./validate');

let validateChain = new ValidateChain();

/* let hash = require ('object-hash'); */

/* let PROOF = 7777;

let validateProof = (proof) => {
    let guessHash = hash(proof);
    console.log("Hashing: ", guessHash);
    return guessHash == hash(PROOF);
};

let proofWork = () => {
    let proof = 0;
    while(true) {
        if(!validateProof(proof)){
            proof++
        } else {
            break;
        }
    }
    return proof;
}


if(proofWork() == PROOF) {
    blockChain.addNewVote("a", "b", 50);
    let prevHash = blockChain.lastBlock() ? blockChain.lastBlock().hash : null;
    blockChain.addNewBlock(prevHash);
} */

/* const prevHash ='prevHash'

const data = [
    { 
        voter: "a",
        candidate: "b",
        voteToken: 1

    },
    { 
        voter: "aa",
        candidate: "b",
        voteToken: 1

    },
    { 
        voter: "aaa",
        candidate: "b",
        voteToken: 1

    },
]; */

/* const nonce = 100;

const hashedvalue = hash.createHash(prevHash, data, nonce);
console.log(hashedvalue); */

/* const nonce = proofOfWork.proofOfWork(prevHash, data);
console.log(nonce);

blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
blockChain.addNewBlock("prevHash", 1, "a");
blockChain.addNewVote('a', 'b', 1)
blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
console.log("Chain : ", blockChain); 
console.log(blockChain.lastBlock()); */

let testchain = {"chain":[{"index":1,"timestamp":1693436465013,"votes":[],"hash":"Genesis","nonce":1,"prevHash":"0"},{"index":2,"timestamp":1693436480102,"votes":[],"hash":"000c8e03ba4df90f47737d9f17b37ed1b0d9584facb19a9c967dc6939bc7ea77","nonce":7576,"prevHash":"Genesis"},{"index":3,"timestamp":1693436483613,"votes":[],"hash":"0005eebbe52b6536063d21249a2dd29d57bc8769994465e662f59aa4b5d28785","nonce":134,"prevHash":"000c8e03ba4df90f47737d9f17b37ed1b0d9584facb19a9c967dc6939bc7ea77"}],"pendingVotes":[],"networkNodes":["http://localhost:3002","http://localhost:3001"],"nodeUrl":"http://localhost:3000"}
console.log(validateChain.validateChain(testchain.chain));