"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txBroadcast = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const gate_ways_1 = require("./gate-ways");
const types_1 = require("./types");
const commander_1 = require("commander");
const private_key_to_cosmos_public_key_1 = require("../utils/cosmos/private-key-to-cosmos-public-key");
const get_auth_info_bytes_1 = require("./get-auth-info-bytes");
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const util_1 = require("@ethereumjs/util");
const tx_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx");
const tx_simulate_1 = require("./tx-simulate");
const get_private_key_1 = require("../utils/get-private-key");
const get_account_info_1 = require("./get-account-info");
const config_1 = require("../config");
const print_1 = require("../utils/print");
async function txBroadcast(broadcastOptions) {
    const gateWays = await (0, gate_ways_1.getGateWays)();
    const { chainId, msg, msgTypes, bodyBytes, key, denom } = broadcastOptions;
    // Get account info
    const accountInfo = await (0, get_account_info_1.getAccountInfo)(key.address);
    // Simulate the transaction to get the gasLimit and gasPrice
    const { gasLimit, gasPrice } = await (0, tx_simulate_1.txSimulate)({ accountInfo, bodyBytes, denom });
    (0, print_1.gfxPrint)(`Tx Simation Success ✅: gasLimit: ${gasLimit}, gasPrice: ${gasPrice}`);
    const privateKey = (0, get_private_key_1.getPrivateKey)();
    if (!privateKey)
        commander_1.program.error("No private key provided");
    const cosmosPublicKey = await (0, private_key_to_cosmos_public_key_1.privateKeyToCosmosPublicKey)(privateKey);
    const types = { ...types_1.coreMessageTypes, ...msgTypes };
    const signature = (0, eth_sig_util_1.signTypedData)({
        data: {
            types,
            primaryType: "Tx",
            domain: {
                name: "Greenfield Tx",
                version: "1.0.0",
                chainId: parseInt(chainId),
                verifyingContract: "greenfield",
                // @ts-expect-error diff from metamask
                salt: "0",
            },
            message: {
                account_number: accountInfo.accountNumber.toString(),
                chain_id: chainId,
                sequence: accountInfo.sequence.toString(),
                memo: "",
                fee: {
                    amount: [
                        {
                            amount: String(BigInt(gasLimit) * BigInt(gasPrice)),
                            denom,
                        },
                    ],
                    gas_limit: String(gasLimit),
                    payer: key.address,
                    granter: "",
                },
                msg,
                timeout_height: "0",
            },
        },
        version: eth_sig_util_1.SignTypedDataVersion.V4,
        privateKey: (0, util_1.toBuffer)(privateKey),
    });
    // Prepare TxRaw
    const rawTx = tx_1.TxRaw.fromPartial({
        bodyBytes,
        authInfoBytes: (0, get_auth_info_bytes_1.getAuthInfoBytes)({
            denom,
            sequence: accountInfo.sequence + "",
            gasLimit,
            gasPrice,
            pubKey: cosmosPublicKey,
        }),
        signatures: [(0, util_1.toBuffer)(signature)],
    });
    const encodedRawTx = tx_1.TxRaw.encode(rawTx).finish();
    const deliverTxResponse = await gateWays.stargate.broadcastTx(encodedRawTx);
    return deliverTxResponse;
}
exports.txBroadcast = txBroadcast;
/**
const sample =
  "CvkFCvYFCiMvZ3JlZW5maWVsZC5zdG9yYWdlLk1zZ0NyZWF0ZU9iamVjdBLOBQoqMHhmNThFMUFkNjNGRTIyQjU1MUNkNDg4NDM5RGY5NEVBMGRlOTg1QzM2EgV3d3cxNxodaGVscHMtMjAyMy0wNS0yOCAxMDozNzoxOC50eHQgyAsoAjIKdGV4dC9wbGFpbjpHCNDPBRJB5mHFvz0Z4zsfBK5626tn+JVIZaH6OGvFls33AovkpOEnOVasrL+8lSSr29vvaTNvdkwWIorSsuPr5/j8pfvmXQFCIKJgoRoZQmKcp8Zmes1OzAghOzPn94HsXjygO7twlxnSQiDBRH36S2dfqfM8e3fh9eMCx6WIL7EELtP5cPBxK0BcjUIgD5D3i2TpKWKHeM6dAU1kL4FV0723HuOAbQy4ljcg8S5CIFjUA7FzKeQlMMBwWZTUs5sgK11tsdKxD0ocKrH1+5CBQiBuRZaQqxmxe8qxahblxRMTaTOOWyzQbfSIIoESFeqNSkIgh6zc+ZcqZVLavmoHelwPlxekEo1WJ7NyXNd+YHT5BztCIKsFlSm2dMJbKPawa4ctO02Cdc3R73+KEZnbZDDquygoUioweDIyODA0NTA0Nzg2RjQ0Mjg5RDQxNTZFNzMxNzE0MmUyNUI5MmMwMGVSKjB4M0NGQzhiMjA5NURBOEYwNzIyNDEyRGMxNmY4QTA2Nzk0MmQyYzY5N1IqMHg1RTM0MEMwNzIxYkQ1ZjQ5NjI3ZTdFMzRlYjk0YmVkZkE1NzVFOTkzUioweDc3MTVkMDY4MGZFODRjQTZkN2VhRUY2ZThBN0NBY0UyOWE0QzAwNjRSKjB4YTNhYzhjMDk5OWI3M2YwMjgxMjJDRTYwOWUzMThjN2RhMDljYjc1MlIqMHhDNmZBM0YzNjQwZTNiNTk0MzM1ZWZBYjM0OWFiZEQ0QTgyQzgzNzM2UioweEU0MkI1QUQ5MEFmRjFlOEFkOTBGNzZlMDI1NDFBNzFDYTlENDFBMTESdQpYCk0KJi9jb3Ntb3MuY3J5cHRvLmV0aC5ldGhzZWNwMjU2azEuUHViS2V5EiMKIQLZ6pULJmtdzFN5IFlJS3cvrgKBPYNQXwsY3dNE1rR80hIFCgMIyAUYXBIZChQKA0JOQhINNjAwMDAwMDAwMDAwMBCwCRpBJw2nuJNBI9Y1pf5OiEXKtqVUfOaCebdAD17tCr4d+bdoz6joxIW3ApPttuT/ZY5/mEo9cRRRW2DtnWJIqpSAbhw=";

const decoded = TxRaw.decode(new Uint8Array(Buffer.from(sample, "base64")));
const bodyBytes = Buffer.from(decoded.bodyBytes)

const msg = TxBody.decode(bodyBytes).messages[0].value;
console.log({msg:MsgCreateObject.decode(msg)})

* */
