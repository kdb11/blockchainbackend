# blockchainbackend

Votechain is a voting blockchain solution with predefined eligible voters and candidates to vote for.

Each voter can vote one time for one candidate.

EligibleVoters = [“Alice”, “Bob”, “Charlie”]

predefinedCandidates =[“CandidateA”, ”CandidateB”]



Example how to use it. 

Start by writing

npm run node-1

npm run node-2

npm run node-3

in three different terminals.



Place a vote through postman post request to 

http://localhost:3000/api/votetoallnodes

and in body write (dont copy paste this)

{
    "voter": "Alice",
    "candidate": "CandidateA",
    "voteToken": 1
}


Then mine a block by making a get request to 

http://localhost:3000/api/mine



After that register a new node by making a post request to 

http://localhost:3000/api/regtoallnodes

and in body write (dont copy paste this)

{
    "nodeUrl": "http://localhost:3001"
}


Now your blockchain should be off sync because you have mined a block but all your nodes dont have the same information.

So make a get request to 

http://localhost:3001/api/consensus



after this your blockchain should be in synch so make another post request to 

http://localhost:3000/api/votetoallnodes

and in body write (dont copy paste this)

{
    "voter": "Bob",
    "candidate": "CandidateB",
    "voteToken": 1
}


and another mine by making a get request to
http://localhost:3000/api/mine

Now you should have three blocks including genesis block with two different votes. To make sure that this is correct we have to count the votes
so make a get request to.
http://localhost:3000/api/votecounts

if everything is correct you should get this response 
{
    "success": true,
    "data": {
        "CandidateA": 1,
        "CandidateB": 1
    }
} 

To double check so everything is correct you can also watch your blockchain on
http://localhost:3000/api/blockchain
And count the blocks + the votes. 
