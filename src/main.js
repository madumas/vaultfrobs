import prodAddresses from '@makerdao/dai-plugin-mcd/contracts/addresses/mainnet';
import vaults from './vaults'
const Web3 = require("web3");
require('dotenv').config();

let wsprovider = process.env.WSNODE;
let mcdConfig={};
mcdConfig.addresses = prodAddresses;

let ws,web3,accountCache;
async function connect() {
  console.log("connect");
  ws = new Web3.providers.WebsocketProvider(wsprovider, {
    clientConfig:
      {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
      }
  });
  ws.on('end', e => {
    console.log('Socket is closed. Reconnect will be attempted in 10 seconds.', e.reason);
    setTimeout(function () {
      connect();
    }, 10000);
  });

  ws.on('error', err => {
    console.error('Socket encountered error: ', err.message, 'Closing socket  and reconnect');
  });

  ws.on('connect', function () {
    console.log('WS Connected');
    web3 = new Web3(ws);
    accountCache = new vaults(web3, mcdConfig);
    accountCache.prefetch().then();
  });
}

connect().then(function(){});
