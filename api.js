const express = require ('express');
let BlockChain = require("./blockChain");
const app = express();

const voteChain = new BlockChain();
app.use(express.json());

app.get('/api/blockchain', (req, res) => {
    res.status(200).json(voteChain);
 });
app.post('/api/vote', (req, res) => { 
    const index = voteChain.addNewVote(req.body.voter, req.body.candidate, req.body.voteToken);
    res.status(201).json({ sucess: true, data: `block index: ${index}` })
});
app.get('/api/mine', (req, res) => { });

app.listen(3000, () => console.log('Server  on port 3000'));