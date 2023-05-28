"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectTx = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const common_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/common");
const long_1 = __importDefault(require("long"));
const config_1 = require("@/config");
const helpers_1 = require("@bnb-chain/greenfield-cosmos-types/helpers");
const any_1 = require("@bnb-chain/greenfield-cosmos-types/google/protobuf/any");
const tx_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx");
const tx_broadcast_1 = require("@/rpc/tx-broadcast");
const types_1 = require("./types");
const tx_2 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx");
async function createObjectTx(msg) {
    // Message type URL
    const typeUrl = "/greenfield.storage.MsgCreateObject";
    // Create the object creation message
    const objectCreationMessage = {
        creator: msg.creator,
        bucketName: msg.bucket_name,
        objectName: msg.object_name,
        payloadSize: long_1.default.fromString(msg.payload_size),
        visibility: (0, common_1.visibilityTypeFromJSON)(msg.visibility),
        contentType: msg.content_type,
        primarySpApproval: {
            expiredHeight: long_1.default.fromString(msg.primary_sp_approval.expired_height),
            sig: (0, helpers_1.bytesFromBase64)(msg.primary_sp_approval.sig),
        },
        expectChecksums: msg.expect_checksums.map((e) => (0, helpers_1.bytesFromBase64)(e)),
        redundancyType: msg.redundancy_type === undefined ? (0, common_1.redundancyTypeFromJSON)(0) : (0, common_1.redundancyTypeFromJSON)(msg.redundancy_type),
        expectSecondarySpAddresses: msg.expect_secondary_sp_addresses,
    };
    // Encode the transaction body
    const bodyBytes = tx_1.TxBody.encode(tx_1.TxBody.fromPartial({
        messages: [
            any_1.Any.fromPartial({
                typeUrl,
                value: tx_2.MsgCreateObject.encode(objectCreationMessage).finish(),
            }),
        ],
    })).finish();
    // Broadcast the transaction
    const resp = await (0, tx_broadcast_1.txBroadcast)({
        key: config_1.KEY,
        bodyBytes,
        msg: { ...msg, type: typeUrl },
        msgTypes: types_1.createObjectMessageTypes,
        chainId: "5600",
        denom: config_1.config.defaultDenom,
    });
    return resp;
}
exports.createObjectTx = createObjectTx;
