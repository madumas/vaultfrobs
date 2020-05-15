Extract the list of all existing vaults from the Maker Protocol.

Detects the fault using `frob` and `fork` events on the Vat.

### Dependencies
1. yarn
2. npm
3. nodejs

### Configuration

Create a `.env` file with the following parameters:

```
WSNODE='<ethereum node websocket url>'
STARTBLOCK=<starting block>
```

On mainnet, `STARTBLOCK` should be 8928160.

### Running
`yarn install`
`npm start`
