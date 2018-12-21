const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data : bytecode})
    .send({ from: accounts[0], gas: '1000000'});
});


describe('Lottery Contract',  () => {
  it('deploys a Contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1,players.length);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]); //checking the conditions....
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3,players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from : accounts[0],
        value : 0
      });
      assert(false); //it will always fail the test and end up in the catch statement...
    } catch (err) {
      //assert.ok(err); for existance
       assert(err);    //we want error;
    }
  });

  it('should be manager to call pickWinner()', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from : accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  //a test from end to end process....
  it('sends money to the winner and resets the player array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2','ether')
    });

    // const c0ontractBalance = await web3.eth.getBalance(lottery.options.address);
    // assert(c0ontractBalance == '0');

    const initailBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initailBalance;
    //verify the difference before and after the lottery
    assert(difference > web3.utils.toWei('1.8','ether'));


    const contractBalance = await web3.eth.getBalance(lottery.options.address);
    //await web3.eth.getBalance(this.address);
    assert(contractBalance == '0');  // for contract balance to be zero after the lottery

    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });

    assert(players.length == 0);  //for resetting of players array...
  });
});





// const assert = require('assert');
// const ganache = require('ganache-cli');
// const Web3 = require('web3');
//
// //const provider = ganache.provider();
// const web3 = new Web3(ganache.provider());
// const { interface, bytecode } = require('../compile');
//
// let accounts;
// let inbox;
//
// beforeEach(async () => {
//   // geta list of all accouts
//   //use one of those accounts to deploy the contract
//
//   accounts = await web3.eth.getAccounts();
//
//   inbox = await new web3.eth.Contract(JSON.parse(interface))
//   .deploy({data:bytecode, arguments : ['Hi there!']})      //deploying a contract...
//   .send({from:accounts[0], gas: '1000000'});
// //  inbox.setProvider(provider);
// });
//
// describe('Inbox',() => {
//   it('delpoys a contract', () =>{
//     assert.ok(inbox.options.address);
//   });
//   it('has a default message', async () => {
//     const message = await inbox.methods.message().call();
//     assert.equal(message, 'Hi there!');
//   });
//
//   it('can change the message', async () => {
//     await inbox.methods.setMessage('Bye').send({ from : accounts[0]});
//     const message = await inbox.methods.message().call();
//     assert.equal(message, 'Bye');
//   });
// })


// describe('Inbox',() => {
//   it('delpoys a contract', () =>{
//     console.log(inbox);
//     console.log(inbox.options.address);
//   });
// })

// use any of them code....with .then or async and await...
// beforeEach(() => {
//   // geta list of all accouts
//   //use one of those accounts to deploy the contract
//
//   web3.eth.getAccounts().then(fetchedAccounts => {
//       console.log(fetchedAccounts);
//     })
// });
//
// describe('Inbox',() => {
//   it('delpoys a contract', () =>{});
// })


















// class Car {
//   park() {
//     return 'stopped';
//   }
//
//   drive() {
//     return 'vroom';
//   }
// }
//
//
// let car;  //undefined value
//
// beforeEach(() => {
//   car = new Car();
// });
//
//
// describe('Car',() => {
//   it('can park',() => {
//     //const car = new Car();
//     assert.equal(car.park(), 'stopped');
//   });
//
//   it('can drive', () => {
//     // const car = new Car();
//     assert.equal(car.drive(), 'vroom');
//   });
// });
