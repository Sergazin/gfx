// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import fs from "fs";
import os from "os";
import path from "path";
import { gfxPrint } from "./utils/print";

const { RPC_ENDPOINT, CHAIN_ID, PASSWORD, MOCK_SIGNATURE, STORAGE_PROVIDER_MONIKER, ZERO_PUBKEY, DEFAULT_DENOM } =
  process.env;

export const config = {
  rpcEndpoint: RPC_ENDPOINT || "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
  chainId: CHAIN_ID || "greenfield_5600-1",
  password: PASSWORD || "Qweqwe1!",
  mockSignature: MOCK_SIGNATURE || "1234567812345678123456781234567812345678123456781234567812345678",
  storageProviderMoniker: STORAGE_PROVIDER_MONIKER || "Titan",
  zeroPubkey: ZERO_PUBKEY || "0x000000000000000000000000000000000000000000000000000000000000000000",
  defaultDenom: DEFAULT_DENOM || "BNB",
};

export type KeyJSON = {
  address: string;
  crypto: {
    cipher: string;
    ciphertext: string;
    cipherparams: { iv: string };
    kdf: string;
    kdfparams: {
      dklen: number;
      n: number;
      p: number;
      r: number;
      salt: string;
    };
    mac: string;
  };
};

// Create GFX Folder fot Key Storage
const homeDirectory = os.homedir();
export const gfxFolderPath = path.join(homeDirectory, ".gfx");

if (!fs.existsSync(gfxFolderPath)) fs.mkdirSync(gfxFolderPath);

// Provide Key
const demoKey = JSON.parse(fs.readFileSync("./demo-key.json", "utf8"));
let KEY = demoKey;
try {
  KEY = JSON.parse(fs.readFileSync(`${gfxFolderPath}/key.json`, "utf8"));
  config.password = fs.readFileSync(`${gfxFolderPath}/password.txt`, "utf8");
} catch (e) {
  gfxPrint(`Key not found at "${gfxFolderPath}/key.json". Using demo key.`);
}

export { KEY };
