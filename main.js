let ChainBlock = require("./chainBlock");

let chainBlock = new ChainBlock();

let hash = require ('object-hash');

let PROOF = 7777;

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
    chainBlock.addNewTransaction("a", "b", 50);
    let prevHash = chainBlock.lastBlock() ? chainBlock.lastBlock().hash : null;
    chainBlock.addNewBlock(prevHash);
}



console.log("Chain : ", chainBlock.chain);