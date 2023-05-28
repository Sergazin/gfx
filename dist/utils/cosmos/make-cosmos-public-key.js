"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCosmosPublicKey = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const keys_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/crypto/secp256k1/keys");
const util_1 = require("@ethereumjs/util");
const makeCosmosPublicKey = (pk) => {
    const publicKey = keys_1.PubKey.fromPartial({ key: (0, util_1.toBuffer)(pk) });
    return {
        typeUrl: "/cosmos.crypto.eth.ethsecp256k1.PubKey",
        value: keys_1.PubKey.encode(publicKey).finish(),
    };
};
exports.makeCosmosPublicKey = makeCosmosPublicKey;
