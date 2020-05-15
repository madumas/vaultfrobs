import vatAbi from '@makerdao/dai-plugin-mcd/contracts/abis/Vat.json';

const abiDecode = require("abi-decoder");
import {sha3, padsig, decodeDSNote} from "./utils";

const dict = {
  vat: {
    frob: sha3('frob(bytes32,address,address,address,int256,int256)'),
    fork: sha3('fork(bytes32,address,address,int256,int256)')
  }
};

let _this;
export default class accounts {
  constructor(web3, mcdConfig) {
    this.addresses = {};
    this.web3 = web3;
    _this = this;
    this.mcdConfig = mcdConfig;
    abiDecode.addABI(vatAbi);
  }

  count() {
    return Object.keys(_this.addresses).length;
  }

  list() {
    return Object.values(_this.addresses);
  }

  _processFrobFork(result) {
    let decoded=decodeDSNote(result);
    const argAddress = (result.topics[0]===padsig(dict.vat.frob))?decoded.arg2:decoded.arg3;
    const address = String('0x'+argAddress.substring(26)).toLowerCase();
    if(typeof _this.addresses[address]==='undefined') {
      _this.addresses[address] = {
        address:address
      };
    }
  }

  batchFetchFrobFork(blockStart, blockEnd ) {
    return new Promise(function(resolve) {
      _this.web3.eth.getPastLogs({
        address: _this.mcdConfig.addresses.MCD_VAT,
        fromBlock: blockStart,
        toBlock: blockEnd,
        topics: [[padsig(dict.vat.frob),padsig(dict.vat.fork)]]
      }).then(function (logs) {
        logs.forEach(log => {
          _this._processFrobFork(log, false);
        });
        resolve();
      }).catch(function (error) {
        console.log(error);
      });
    })
  }

  async prefetch() {
    const step=20000;
    const lastblock = await _this.web3.eth.getBlockNumber();
    const startblock = Number(process.env.STARTBLOCK);

    console.log('Syncing Frob(s), starting at block:'+startblock);
    for (let block = startblock; block<lastblock; block+=step) {
      const blockend = (lastblock-block < step)?lastblock:block+step;
      console.log(block+'-'+blockend);
      await this.batchFetchFrobFork(block, blockend);
    }
    console.log("Finished syncing Frob");
    console.log(this.list().map(x=>x.address.toString()).join('\n'));
    console.log(this.count() + ' urns');
  }
}
