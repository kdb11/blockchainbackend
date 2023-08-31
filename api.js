const express = require ('express');
const fetch = require('node-fetch');
let ProofOfWork = require ('./proofOfWork');
let proofOfWork = new ProofOfWork();
let Hash = require ('./hash');
let hashedvalue = new Hash();
const eligibleVoters = ["Alice", "Bob", "Charlie"];
const predefinedCandidates = ["CandidateA", "CandidateB"];
const candidateVoteCounts = {};
let BlockChain = require("./blockChain");
const { default: axios } = require('axios');
const voteChain = new BlockChain();
let ValidateChain = require ('./validate');
let validateChain = new ValidateChain();
const PORT = process.argv[2];

console.log(proofOfWork, hashedvalue);

const app = express();

app.use(express.json());

app.get('/api/blockchain', (req, res) => {
    res.status(200).json(voteChain);
 });

 app.post('/api/votetoallnodes', (req, res) => { 
    const voter = req.body.voter;
    const candidate = req.body.candidate;

    if (eligibleVoters.includes(voter) && predefinedCandidates.includes(candidate)) {
        const vote = voteChain.addNewVote(voter, candidate, req.body.voteToken);

        const voterIndex = eligibleVoters.indexOf(voter);
        if (voterIndex !== -1) {
            eligibleVoters.splice(voterIndex, 1);
        }

        if (!candidateVoteCounts[candidate]) {
            candidateVoteCounts[candidate] = 1;
        } else {
            candidateVoteCounts[candidate]++;
        }

        voteChain.addVoteToPendingVotes(vote);
 
        voteChain.networkNodes.forEach(async(url) => {
            await axios.post(`${url}/api/vote`, vote);
        });
 
        res.status(201).json({ success: true, data: 'Vote broadcasted to all nodes', candidateVotes: candidateVoteCounts });
    } else {
        res.status(400).json({ success: false, errorMessage: 'Invalid voter or candidate' });
    }
});
 
app.post('/api/vote', (req, res) => { 
    const voter = req.body.voter;
    const candidate = req.body.candidate;
 
    if (eligibleVoters.includes(voter) && predefinedCandidates.includes(candidate)) {
        const vote = req.body;
        const index = voteChain.addVoteToPendingVotes(vote);

        const voterIndex = eligibleVoters.indexOf(voter);
        if (voterIndex !== -1) {
            eligibleVoters.splice(voterIndex, 1);
        }

        if (!candidateVoteCounts[candidate]) {
            candidateVoteCounts[candidate] = 1;
        } else {
            candidateVoteCounts[candidate]++;
        }

        res.status(201).json({ success: true, data: `Block index: ${index}`, candidateVotes: candidateVoteCounts });
    } else {
        res.status(400).json({ success: false, errorMessage: 'Invalid voter or candidate' });
    }
});

app.get('/api/votecounts', (req, res) => {
    const candidateVotes = voteChain.countVotes();
    res.status(200).json({ success: true, data: candidateVotes });
});

app.get('/api/mine', async(req, res) => { 
    const prevBlock = voteChain.lastBlock();
    const prevBlockHash = prevBlock.hash;

    const data = {
        data: voteChain.pendingVotes,
        index: prevBlock.index + 1,
    };

    const nonce = proofOfWork.proofOfWork(prevBlockHash, data);

    const hash = hashedvalue.createHash(prevBlockHash, data, nonce);

    const block = voteChain.addNewBlock(prevBlockHash, nonce, hash);

    voteChain.networkNodes.forEach(async(url) => {
        await axios.post(`${url}/api/block`, { block: block });
    });

    /* await axios.post(`${voteChain.nodeUrl}/api/votetoallnodes`, {}) */
    res.status(200).json({
        sucess: true,
        data: block,
    });
});

app.post('/api/block', (req, res) => {
    const block = req.body.block;
    const lastBlock = voteChain.lastBlock();
    const correctHash = lastBlock.hash == block.prevHash;
    const correctIndex = lastBlock.index + 1 == block.index;

    if (correctHash && correctIndex){
        voteChain.chain.push(block);
        voteChain.pendingVotes = [];
        res.status(201).json({ success: true, data: block });
    } else {
        res.status(400).json({ success: false, errorMessage: 'block not correct', data: block });
    }
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

app.get('/api/consensus', async (req, res) => {
    const currentChainLength = voteChain.chain.length;
    let maxLength = currentChainLength;
    let longestChain = null;
    let pendingList = null;
  
    const networkRequests = voteChain.networkNodes.map(async (node) => {
      try {
        const response = await axios.get(`${node}/api/blockchain`);
        const data = response.data;
  
        if (data.chain.length > maxLength) {
          maxLength = data.chain.length;
          longestChain = data.chain;
          pendingList = data.pendingList;
        }
      } catch (error) {
        console.error('Error fetching data from network node:', error);
      }
    });
  
    await Promise.all(networkRequests);
  
    if (!longestChain || !validateChain.validateChain(longestChain)) {
      console.log('No replacement needed');
      res.status(200).json({ success: true, data: voteChain });
    } else {
      voteChain.chain = longestChain;
      voteChain.pendingList = pendingList;
      res.status(200).json({ success: true, data: voteChain });
    }
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