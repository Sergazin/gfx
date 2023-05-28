"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@/config");
async function upload(endpoint, txnHash, file) {
    const response = await axios_1.default.put(endpoint, file, {
        headers: {
            Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config_1.config.mockSignature}`,
            "X-Gnfd-Txn-hash": txnHash,
            "X-Gnfd-User-Address": config_1.KEY.address,
        },
    });
    return response;
}
exports.upload = upload;
