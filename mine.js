const Transaction = require("./Transaction");
require('dotenv').config()
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const db = require('./db');
const Block = require('./Block');
const UTXO = require('./UTXO');
const BLOCK_REWARD = 5;
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const fs = require('fs');


function mine () {

    const block = new Block();

    const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
    const coinbaseTX = new Transaction([], [coinbaseUTXO]);
    block.addTransaction(coinbaseTX);

    while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
        block.nonce++;
    }

    block.execute();

    db.blockchain.addBlock(block);

    let data = JSON.stringify(block, null, 2);
    fs.appendFileSync("data.json", data + '\n' );

    setTimeout(mine, 2500);
}

mine();