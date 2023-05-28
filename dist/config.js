"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY = exports.gfxFolderPath = exports.config = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const print_1 = require("./utils/print");
const { RPC_ENDPOINT, CHAIN_ID, PASSWORD, MOCK_SIGNATURE, STORAGE_PROVIDER_MONIKER, ZERO_PUBKEY, DEFAULT_DENOM } = process.env;
exports.config = {
    rpcEndpoint: RPC_ENDPOINT || "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
    chainId: CHAIN_ID || "greenfield_5600-1",
    password: PASSWORD || "Qweqwe1!",
    mockSignature: MOCK_SIGNATURE || "1234567812345678123456781234567812345678123456781234567812345678",
    storageProviderMoniker: STORAGE_PROVIDER_MONIKER || "Titan",
    zeroPubkey: ZERO_PUBKEY || "0x000000000000000000000000000000000000000000000000000000000000000000",
    defaultDenom: DEFAULT_DENOM || "BNB",
};
// Create GFX Folder fot Key Storage
const homeDirectory = os_1.default.homedir();
exports.gfxFolderPath = path_1.default.join(homeDirectory, ".gfx");
if (!fs_1.default.existsSync(exports.gfxFolderPath))
    fs_1.default.mkdirSync(exports.gfxFolderPath);
// Provide Key
const demoKey = JSON.parse(fs_1.default.readFileSync("./demo-key.json", "utf8"));
let KEY = demoKey;
exports.KEY = KEY;
try {
    exports.KEY = KEY = JSON.parse(fs_1.default.readFileSync(`${exports.gfxFolderPath}/key.json`, "utf8"));
    exports.config.password = fs_1.default.readFileSync(`${exports.gfxFolderPath}/password.txt`, "utf8");
}
catch (e) {
    (0, print_1.gfxPrint)(`Key not found at "${exports.gfxFolderPath}/key.json". Using demo key.`);
}
