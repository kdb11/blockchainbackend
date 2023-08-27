const express = require ('express');
let ProofOfWork = require ('./proofOfWork');
let proofOfWork = new ProofOfWork();
let Hash = require ('./hash');
let hashedvalue = new Hash();
let BlockChain = require("./blockChain");
const voteChain = new BlockChain();

console.log(proofOfWork, hashedvalue);

const app = express();

app.use(express.json());

app.get('/api/blockchain', (req, res) => {
    res.status(200).json(voteChain);
 });
app.post('/api/vote', (req, res) => { 
    const index = voteChain.addNewVote(req.body.voter, req.body.candidate, req.body.voteToken);
    res.status(201).json({ sucess: true, data: `block index: ${index}` })
});
app.get('/api/mine', (req, res) => { 
    const prevBlock = voteChain.lastBlock();
    const prevBlockHash = prevBlock.hash;

    const data = {
        data: voteChain.pendingVotes,
        index: prevBlock.index + 1,
    };

    const nonce = proofOfWork.proofOfWork(prevBlockHash, data);

    const hash = hashedvalue.createHash(prevBlockHash, data, nonce);

    const block = voteChain.addNewBlock(prevBlockHash, nonce, hash);

    res.status(200).json({
        sucess: true,
        data: block,
    });
});

app.listen(3000, () => console.log('Server  on port 3000'));