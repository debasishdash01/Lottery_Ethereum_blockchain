const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

//Specify which account we want to unlock and what outside node we are going to connect
//const provider = new HDWalletProvider('account mneumonic','infura api');
const provider = new HDWalletProvider(
 //Account mneumonic argument
 'large height must ticket wreck police bread profit fringe panther trigger shed',
'https://rinkeby.infura.io/v3/8579b40be63b49deb26c6ae72c1fac33' 
);


const web3 = new Web3(provider);

//Helper function for async/await syntax

const deploy = async () => {

    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy( { data: bytecode } )
        .send( { gas: '1000000', from: accounts[0] } )

    //Print out the address of our contract so that we can record and use it afterwards
    
    console.log('Contract deployed to this address: ', result.options.address);

    //To prevent a hanging deployment
    provider.engine.stop();

};
deploy();