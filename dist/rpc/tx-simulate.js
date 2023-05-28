"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txSimulate = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const gate_ways_1 = require("@/rpc/gate-ways");
const service_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service");
const get_auth_info_bytes_1 = require("./get-auth-info-bytes");
const make_cosmos_public_key_1 = require("@/utils/cosmos/make-cosmos-public-key");
const config_1 = require("@/config");
const tx_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx");
const commander_1 = require("commander");
async function txSimulate(opts) {
    const gateWays = await (0, gate_ways_1.getGateWays)();
    const { accountInfo, bodyBytes, denom } = opts;
    const rpc = new service_1.ServiceClientImpl(gateWays.protobuf);
    const authInfoBytes = (0, get_auth_info_bytes_1.getAuthInfoBytes)({
        denom,
        sequence: accountInfo.sequence + "",
        gasLimit: 0,
        gasPrice: "0",
        pubKey: (0, make_cosmos_public_key_1.makeCosmosPublicKey)(config_1.config.zeroPubkey),
    });
    const tx = tx_1.Tx.fromPartial({
        authInfo: tx_1.AuthInfo.decode(authInfoBytes),
        body: tx_1.TxBody.decode(bodyBytes),
        signatures: [Uint8Array.from([])],
    });
    try {
        const simulateTxResult = await rpc.Simulate(service_1.SimulateRequest.fromPartial({ txBytes: tx_1.Tx.encode(tx).finish() }));
        if (!simulateTxResult.gasInfo)
            throw new Error("Simulate failed ❌: gasInfo is undefined");
        return {
            gasLimit: simulateTxResult.gasInfo?.gasUsed.toNumber(),
            gasPrice: simulateTxResult.gasInfo?.minGasPrice.replace(denom, ""),
        };
    }
    catch (e) {
        if (e instanceof Error) {
            if (e.message.includes("Bucket already exists")) {
                commander_1.program.error(`Simulate failed ❌: Bucket already exists`);
            }
            else if (e.message.includes("Object already exists")) {
                commander_1.program.error(`Simulate failed ❌: Object already exists`);
            }
            else
                commander_1.program.error(`Simulate failed ❌: ${e.message}`);
        }
        else
            commander_1.program.error(`Simulate failed ❌: ${e}`);
    }
}
exports.txSimulate = txSimulate;
