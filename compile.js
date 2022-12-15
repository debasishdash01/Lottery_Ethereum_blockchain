const path = require("path");
const fs = require("fs");

//Solidity compiler
const solc = require("solc");

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");

//Fetching the contents of Inbox.sol as we can’t directly use require as it will just execute Inbox.sol like a JS file
const source = fs.readFileSync(lotteryPath, "utf8");
//console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[':Lottery'];