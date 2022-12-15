const assert = require('assert');
const ganache =  require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface,bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	lottery = await new web3.eth.Contract(JSON.parse(interface))
	.deploy( {data: bytecode })
	.send({ from:accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
	it('deploys a contract', () => {
		assert.ok(lottery.options.address);
	});

	it('allows one account to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.2', 'ether'),
		});
		const players = await lottery.methods.getAllPlayers().call({
			from: accounts[0],
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(1,players.length);
	});
	it('allows one multiple to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.2', 'ether'),
		});

		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.2', 'ether'),
		});

		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.2', 'ether'),
		});

		const players = await lottery.methods.getAllPlayers().call({
			from: accounts[0],
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);
		assert.equal(3,players.length);
	});
	 it('requires a minimum amount of ether to enter', async() => {
		//Wrapping the await in try block
		 try {
		 await lottery.methods.enter().send({
		 from: accounts[0],
		 value: 200, //it will be in wei
		 });
	    //failing assertion, if we don't fail the test next line will make the test as failed
		 assert(false);
		 } catch (err) {
		 //assert will make sure
		 //We are deliberately making an error to test our Lottery.test.js
		 assert(err);
		 }
		 });
		 it('only manager can call pickWinner', async() => {
			 try{
			 await lottery.methods.pickWinner().send({
			 //this is not the manager account
			 //since we are using another account
			//onlyManager modifier won't allow to call the pickWinner function at first place
					 // and try block will throw an error, caught by catch
					 // which will pass the test
			 from: accounts[1]
			 });
			assert(false);
			 } catch (err) {
			 assert(err);
			 }
			 });
			 it('sends money to the winner', async() => {
				 await lottery.methods.enter().send({
				 from: accounts[0],
				 value: web3.utils.toWei('1','ether')
				 });
				 //Now we figure out how account[0] wins. To do that we can
			     //Retrieve the account[0] balance that before and after calling the pickWinner
				 //We will use the getBalance function that return the amount of ether in wei that an account has
				const initialBalance = await web3.eth.getBalance(accounts[0]);
				 //Calling the pickWinner function
				 await lottery.methods.pickWinner().send({ from: accounts[0] });
				//Difference between will be ~2 ether, because we also need to consider the gas
				 const finalBalance = await web3.eth.getBalance(accounts[0]);
				 const difference = finalBalance - initialBalance;
				//0.8 will take care of the gas cost
				 assert(difference > web3.utils.toWei('0.8','ether'));
				});
				it('checks players array empties after picking winner',async() => {

					 await lottery.methods.enter().send({
					 from: accounts[0],
					value: web3.utils.toWei('2','ether')
					 })
					
					 await lottery.methods.pickWinner().send({
					 from: accounts[0]
					 })
					
					 const players = await lottery.methods.getAllPlayers().call();
					 // console.log(players.length);
					 assert(players.length == 0);
					
					});
					it('checks the lottery balance is empty after pick winner is called',async() => {
						
						const ipoolbalance = await web3.eth.getBalance(lottery.options.address);
						console.log(ipoolbalance);
						
						 await lottery.methods.enter().send({
						 from: accounts[0],
						 value: web3.utils.toWei('2','ether')
						 })
						 const poolbalance = await web3.eth.getBalance(lottery.options.address);
						 console.log(poolbalance);

						 await lottery.methods.pickWinner().send({
						 from: accounts[0]
						 })
						
						 const balance = await web3.eth.getBalance(lottery.options.address);
						 console.log(balance);
						 assert(balance==0)
						 });
						});
						
					
				