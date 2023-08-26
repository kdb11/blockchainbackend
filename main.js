let BlockChain = require("./blockChain");

let blockChain = new BlockChain();

let Hash = require ('./hash');

let hash = new Hash();

let ProofOfWork = require ('./proofOfWork');

let proofOfWork = new ProofOfWork();

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

const prevHash ='prevHash'

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
];

/* const nonce = 100;

const hashedvalue = hash.createHash(prevHash, data, nonce);
console.log(hashedvalue); */

const nonce = proofOfWork.proofOfWork(prevHash, data);
console.log(nonce);

/* blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
console.log("Chain : ", blockChain); */