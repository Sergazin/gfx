"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBucket = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const config_1 = require("@/config");
const tx_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx");
const any_1 = require("@bnb-chain/greenfield-cosmos-types/google/protobuf/any");
const tx_2 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx");
const tx_broadcast_1 = require("@/rpc/tx-broadcast");
const print_1 = require("@/utils/print");
async function deleteBucket(bucketName) {
    // Step 0: Prepare
    if (bucketName.startsWith("gnfd://"))
        bucketName = bucketName.slice(7);
    (0, print_1.gfxPrint)(`Delete bucket "${bucketName}"⛔️. Starting... ⌛️`);
    const typeUrl = "/greenfield.storage.MsgDeleteBucket";
    // Step 1: Create the message and the transaction body
    const bucketRemoveMessage = {
        bucketName,
        operator: config_1.KEY.address,
    };
    const msg = {
        bucket_name: bucketName,
        operator: config_1.KEY.address,
        type: typeUrl,
    };
    const bodyBytes = tx_1.TxBody.encode(tx_1.TxBody.fromPartial({
        messages: [
            any_1.Any.fromPartial({
                typeUrl,
                value: tx_2.MsgDeleteBucket.encode(bucketRemoveMessage).finish(),
            }),
        ],
    })).finish();
    // Step 2: Broadcast the transaction
    const tx = await (0, tx_broadcast_1.txBroadcast)({
        key: config_1.KEY,
        denom: config_1.config.defaultDenom,
        bodyBytes,
        msg,
        msgTypes: {
            Msg: [
                {
                    name: "type",
                    type: "string",
                },
                {
                    name: "operator",
                    type: "string",
                },
                {
                    name: "bucket_name",
                    type: "string",
                },
            ],
        },
        chainId: "5600",
    });
    // Step 3: Print the result
    (0, print_1.gfxPrint)(`Bucket "${bucketName}" removed! ❌🪣\nTransaction Hash: ${tx.transactionHash}`);
}
exports.deleteBucket = deleteBucket;
