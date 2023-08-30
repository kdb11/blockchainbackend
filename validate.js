
let Hash = require ('./hash');

let hash = new Hash();

class ValidateChain { 
    validateChain (blockChain) {
        let isValid = true;
        var i;
      
        for (i = 1; i < blockChain.length; i++) {
          const block = blockChain[i];
          const prevBlock = blockChain[i - 1];
        const hashedvalue = hash.createHash(prevBlock.hash, { data: block.votes, index: block.index }, block.nonce);
            
          
          if (hashedvalue !== block.hash) {
            isValid = false;
            return "hash is false";
          }
      
          if (block.prevHash !== prevBlock.hash) {
            isValid = false;
            return "prev hash is false";
          }
        }

        const genesisBlock = blockChain.at(0);
        const isGenesisNonceValid = genesisBlock.nonce === 1;
        const isGenesisHashValid = genesisBlock.hash === "Genesis";
        const isGenesisPreviousHashValid = genesisBlock.prevHash === "0";
        const hasNoData = genesisBlock.votes.length === 0;
      
        if (!isGenesisNonceValid || !isGenesisHashValid || !isGenesisPreviousHashValid || !hasNoData) {
          isValid = false;
          return "genesis is false"
        }
      
        return isValid;
    };

}

module.exports = ValidateChain;