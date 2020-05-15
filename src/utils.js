import Web3 from 'web3';

export const sha3 = (str) => {
    return Web3.utils.sha3(str).substring(0,10)
};
export const padsig = (sig) => {
    return sig+'00000000000000000000000000000000000000000000000000000000';
};

export const decodeDSNote = log => {
    return (new Web3).eth.abi.decodeLog(
        [
            {
                type: 'bytes4',
                name: 'sig',
                indexed: true
            },
            {
                type: 'bytes32',
                name: 'arg1',
                indexed: true
            },
            {
                type: 'bytes32',
                name: 'arg2',
                indexed: true
            },
            {
                type: 'bytes32',
                name: 'arg3',
                indexed: true
            },
            {
                type: 'bytes',
                name: 'data',
                indexed: false
            }
        ],log.data, log.topics);
};


export const padToBytes32 = (n) => {
    while (n.length < 64) {
        n = "0" + n;
    }
    return "0x" + n;
};
