"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthInfoBytes = void 0;
const proto_signing_1 = require("@cosmjs/proto-signing");
function getAuthInfoBytes(params) {
    const { pubKey, denom, sequence, gasLimit, gasPrice } = params;
    if (!pubKey)
        throw new Error("pubKey is required");
    const feeAmount = [{ denom, amount: String(BigInt(gasLimit) * BigInt(gasPrice)) }];
    const feeGranter = undefined;
    const feePayer = undefined;
    const authInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)([{ pubkey: pubKey, sequence: Number(sequence) }], feeAmount, gasLimit, feeGranter, feePayer, 712);
    return authInfoBytes;
}
exports.getAuthInfoBytes = getAuthInfoBytes;
