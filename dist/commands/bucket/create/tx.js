"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBucketTx = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const common_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/common");
const tx_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx");
const long_1 = __importDefault(require("long"));
const config_1 = require("@/config");
const types_1 = require("./types");
const helpers_1 = require("@bnb-chain/greenfield-cosmos-types/helpers");
const any_1 = require("@bnb-chain/greenfield-cosmos-types/google/protobuf/any");
const tx_2 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx");
const tx_broadcast_1 = require("@/rpc/tx-broadcast");
async function createBucketTx({ msg }) {
    // Message type URL
    const typeUrl = "/greenfield.storage.MsgCreateBucket";
    // Create the bucket creation message
    const bucketCreationMessage = {
        creator: msg.creator,
        bucketName: msg.bucket_name,
        visibility: (0, common_1.visibilityTypeFromJSON)(msg.visibility),
        primarySpAddress: msg.primary_sp_address,
        primarySpApproval: {
            expiredHeight: long_1.default.fromString(msg.primary_sp_approval.expired_height),
            sig: (0, helpers_1.bytesFromBase64)(msg.primary_sp_approval.sig),
        },
        chargedReadQuota: msg.charged_read_quota ? long_1.default.fromString("0") : long_1.default.fromString(msg.charged_read_quota),
        paymentAddress: "",
    };
    // Encode the transaction body
    const bodyBytes = tx_2.TxBody.encode(tx_2.TxBody.fromPartial({
        messages: [
            any_1.Any.fromPartial({
                typeUrl,
                value: tx_1.MsgCreateBucket.encode(bucketCreationMessage).finish(),
            }),
        ],
    })).finish();
    // Broadcast the transaction
    const resp = await (0, tx_broadcast_1.txBroadcast)({
        key: config_1.KEY,
        bodyBytes,
        msg: { ...msg, type: typeUrl },
        msgTypes: types_1.createBucketMessageTypes,
        chainId: "5600",
        denom: config_1.config.defaultDenom,
    });
    return resp;
}
exports.createBucketTx = createBucketTx;
