"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalGateway = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const object_to_hex_string_encode_decode_1 = require("../utils/object-to-hex-string-encode-decode");
const commander_1 = require("commander");
async function approvalGateway(endpoint, message) {
    const response = await axios_1.default.get(endpoint, {
        headers: {
            Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config_1.config.mockSignature}`,
            "X-Gnfd-Unsigned-Msg": (0, object_to_hex_string_encode_decode_1.encodeObjectToHexString)(message),
        },
    });
    const encodedSignedMessage = response.headers["x-gnfd-signed-msg"];
    const signedApprovalMessage = (0, object_to_hex_string_encode_decode_1.decodeObjectFromHexString)(encodedSignedMessage);
    if (!signedApprovalMessage)
        commander_1.program.error("Approval error ❌");
    return signedApprovalMessage;
}
exports.approvalGateway = approvalGateway;
