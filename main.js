let BlockChain = require("./blockChain");

let blockChain = new BlockChain();

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

blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
blockChain.addNewBlock("prevHash", 1);
blockChain.addNewVote('a', 'b', 1)
console.log("Chain : ", blockChain.chain);