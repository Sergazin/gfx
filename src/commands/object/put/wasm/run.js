/* eslint-disable */
"use strict";

const path = require("path");
globalThis.require = require;
globalThis.fs = require("fs");
globalThis.TextEncoder = require("util").TextEncoder;
globalThis.TextDecoder = require("util").TextDecoder;

globalThis.performance = {
  now() {
    const [sec, nsec] = process.hrtime();
    return sec * 1000 + nsec / 1000000;
  },
};

const crypto = require("crypto");
globalThis.crypto = {
  getRandomValues(b) {
    crypto.randomFillSync(b);
  },
};

require("./go-wrapper");

const go = new Go();
go.argv = process.argv.slice(1);
go.env = Object.assign({ TMPDIR: require("os").tmpdir() }, process.env);
go.exit = process.exit;

let filePath = process.argv[2];
const segmentSize = 16 * 1024 * 1024;
const dataBlocks = 4;
const parityBlocks = 2;
const wasmFilePath = path.resolve(__dirname, "./hash-calculator.wasm");

WebAssembly.instantiate(fs.readFileSync(wasmFilePath), go.importObject)
  .then((result) => {
    process.on("exit", (_code) => {
      const fileBytes = fs.readFileSync(filePath);
      const result = globalThis["getCheckSums"](new Uint8Array(fileBytes), segmentSize, dataBlocks, parityBlocks);
      console.log(
        JSON.stringify({
          hashArray: JSON.parse(result.expectCheckSums),
          contentLength: result.contentLength,
        })
      );
      process.exit();
    });
    return go.run(result.instance);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
