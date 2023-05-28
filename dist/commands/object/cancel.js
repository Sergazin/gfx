"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelCreateObject = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const tx_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx");
const utils_1 = require("./utils");
const config_1 = require("@/config");
const tx_2 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx");
const any_1 = require("@bnb-chain/greenfield-cosmos-types/google/protobuf/any");
const tx_broadcast_1 = require("@/rpc/tx-broadcast");
const print_1 = require("@/utils/print");
async function cancelCreateObject(objectUrl) {
    const { bucketName, objectPath } = (0, utils_1.parseObjectUrl)(objectUrl);
    (0, print_1.gfxPrint)(`Canceling object "${objectPath}" in "${bucketName}" creation... ⏳`);
    const typeUrl = "/greenfield.storage.MsgCancelCreateObject";
    // Step 1: Create the message and the transaction body
    const objectRemoveMessage = {
        operator: config_1.KEY.address,
        bucketName,
        objectName: objectPath,
    };
    const msg = {
        operator: config_1.KEY.address,
        bucket_name: bucketName,
        object_name: objectPath,
        type: typeUrl,
    };
    const bodyBytes = tx_2.TxBody.encode(tx_2.TxBody.fromPartial({
        messages: [
            any_1.Any.fromPartial({
                typeUrl,
                value: tx_1.MsgCancelCreateObject.encode(objectRemoveMessage).finish(),
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
                {
                    name: "object_name",
                    type: "string",
                },
            ],
        },
        chainId: "5600",
    });
    // Step 3: Print the result
    (0, print_1.gfxPrint)(`Object "${objectPath}" in "${bucketName}" creation canceled! ❌\nTransaction Hash: ${tx.transactionHash}`);
}
exports.cancelCreateObject = cancelCreateObject;
