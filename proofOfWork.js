let Hash = require ('./hash');

let hash = new Hash();

class ProofOfWork { 
    proofOfWork(prevHash, data ) {
        let nonce = 0;
        let hashedvalue = hash.createHash(prevHash, data, nonce);

        while (hashedvalue.substring(0, 3) !== '000') {
            nonce++;
            hashedvalue = hash.createHash(prevHash, data, nonce);
            console.log(hashedvalue);
        }

        return nonce;
    }

}

module.exports = ProofOfWork;