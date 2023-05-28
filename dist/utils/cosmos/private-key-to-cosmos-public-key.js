"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKeyToCosmosPublicKey = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const util_1 = require("@ethereumjs/util");
const secp256k1_compat_1 = require("ethereum-cryptography/secp256k1-compat");
const make_cosmos_public_key_1 = require("./make-cosmos-public-key");
async function privateKeyToCosmosPublicKey(privateKey) {
    const privateKeyBytes = (0, util_1.toBuffer)(privateKey);
    const publicKeyBytes = (0, secp256k1_compat_1.publicKeyCreate)(privateKeyBytes);
    const publicKeyString = (0, util_1.bufferToHex)((0, util_1.toBuffer)(publicKeyBytes));
    const cosmosPublicKey = (0, make_cosmos_public_key_1.makeCosmosPublicKey)(publicKeyString);
    return cosmosPublicKey;
}
exports.privateKeyToCosmosPublicKey = privateKeyToCosmosPublicKey;
