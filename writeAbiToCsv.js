/**
 * 1. Create csv file if not exists
 */

"use strict";

const fs = require("fs");
const { parse } = require("csv-parse");
const fsPromises = require("fs/promises");
const Web3 = require("web3");
const fileName = "../functionSignatures.csv";

const web3 = new Web3("");

let existingSignatures = new Set();

if (fs.existsSync(fileName)) {
  console.log("Exists!");
  /**
   * Load file and add all sigs to Set
   * Close file
   */
  fs.createReadStream(fileName)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      existingSignatures.add(row[0]);
    });
} else {
  fs.writeFileSync(fileName, "");
}
const basePath = "../Sovryn-frontend/src/utils/blockchain/abi";

fs.readdir(
  "../Sovryn-frontend/src/utils/blockchain/abi",

  async (err, files) => {
    files.forEach(async (file) => {
      console.log(file);
      const contractName = file.split(".json")[0];
      const rawAbi = fs.readFileSync(basePath + "/" + file);
      const abi = JSON.parse(rawAbi);
      const abiFunctions = abi.filter((item) => item.type === "function");
      abiFunctions.forEach(async (abiItem) => {
        const name = abiItem.name;
        const sig = web3.eth.abi.encodeFunctionSignature(abiItem);
        /**
         * Write to csv
         */
        if (!existingSignatures.has(sig)) {
          try {
            const text = `${sig}, ${name}, ${contractName}\n`;
            await fsPromises.appendFile(fileName, text);
            console.log(file + " added");
          } catch (err) {
            console.log(err);
          }
        }
        existingSignatures.add(sig);
      });
    });
  }
);
