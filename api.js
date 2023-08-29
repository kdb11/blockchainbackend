const express = require ('express');
const fetch = require('node-fetch');
let ProofOfWork = require ('./proofOfWork');
let proofOfWork = new ProofOfWork();
let Hash = require ('./hash');
let hashedvalue = new Hash();
let BlockChain = require("./blockChain");
const voteChain = new BlockChain();
const PORT = process.argv[2];

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

app.post('/api/regtoallnodes', async(req, res) => {
    const urlToAdd = req.body.nodeUrl;

    if(voteChain.networkNodes.indexOf(urlToAdd) === -1) {
        voteChain.networkNodes.push(urlToAdd);
    }

    voteChain.networkNodes.forEach(async(url) => {
        const body = { nodeUrl: urlToAdd};

        await fetch(`${url}/api/regnode`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json'}
        });
    });

    const body = {nodes: [...voteChain.networkNodes, voteChain.nodeUrl] };

    await fetch(`${urlToAdd}/api/regnodes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'}
    });

    res.status(201).json({ success: true, data: 'New node/nodes added in network' });
});

app.post('/api/regnode', (req, res) => {

    const url = req.body.nodeUrl; 

    if(voteChain.networkNodes.indexOf(url) == -1 && voteChain.nodeUrl !== url) {
        voteChain.networkNodes.push(url);
    }

    res.status(201).json({sucess: true, data: 'New node added'})
});

app.post('/api/regnodes', (req, res) => {
    const newNodes = req.body.nodes;

    newNodes.forEach(url => {
        if (voteChain.networkNodes.indexOf(url) === -1 && voteChain.nodeUrl !== url) {
            voteChain.networkNodes.push(url);
        }
    });

    res.status(201).json({ success: true, data: 'New nodes added' });
});

/* app.post('/api/regnodes', (req, res) => {
    const newNodes = req.body.nodes;
    const singleNode = req.body.nodeUrl;

    function addNodeToNetwork(nodeUrl) {
        if (voteChain.networkNodes.indexOf(nodeUrl) === -1 && voteChain.nodeUrl !== nodeUrl) {
            voteChain.networkNodes.push(nodeUrl);
        }
    }

    if (newNodes && Array.isArray(newNodes)) {
        newNodes.forEach(nodeUrl => {
            addNodeToNetwork(nodeUrl);
        });
    }

    if (singleNode && typeof singleNode === 'string') {
        addNodeToNetwork(singleNode);
    }

    res.status(201).json({ success: true, data: 'New nodes added' });
}); */
app.listen(PORT, () => console.log(`Server on port ${PORT}`));