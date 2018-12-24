const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
  'opera intact grass artefact open swamp beach debate category act snake orchard',
  'https://rinkeby.infura.io/v3/612c882eef4c4f7c84f606836087009e'
);

const web3 = new Web3(provider);
let result;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data:bytecode })  //no arguments in lottery constructor
    .send({gas: '1000000',from : accounts[0]});
   //record the address or deployed contract....


   console.log(interface);
   console.log('Contract deployed to', result.options.address);

};

deploy();
