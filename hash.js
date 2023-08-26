const sha256 = require('sha256')

class Hash { 
    createHash(prevHash, data, nonce ) {
        const hashing = prevHash + JSON.stringify(data) + nonce.toString();
        const hash = sha256(hashing);

        return hash;
    }

}

module.exports = Hash;