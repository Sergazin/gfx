"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBucketToString = exports.listBuckets = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const config_1 = require("../../config");
const get_selected_storage_provider_1 = require("../../rpc/get-selected-storage-provider");
const axios_1 = __importDefault(require("axios"));
const print_1 = require("../../utils/print");
const common_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/common");
async function listBuckets(flags) {
    const walletAddress = config_1.KEY.address;
    (0, print_1.gfxPrint)(`Requesting bucket list... ⏳`, ` - Wallet address 💳: ${walletAddress}`, "");
    const sp = await (0, get_selected_storage_provider_1.getStorageProvider)(flags.primarySpAddress);
    const response = await axios_1.default.get(sp.endpoint, {
        headers: {
            Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config_1.config.mockSignature}`,
            "X-Gnfd-User-Address": walletAddress,
        },
    });
    const formatted = response.data.buckets.filter((b) => !b.removed).map(formatBucketToString);
    (0, print_1.gfxPrint)(...formatted);
}
exports.listBuckets = listBuckets;
function formatBucketToString(bucket) {
    const { bucket_name, visibility, id } = bucket.bucket_info;
    const formattedBucket = `🪣  ${bucket_name} [ID: ${id}]
    - Visibility: ${common_1.VisibilityType[visibility]}
`;
    return formattedBucket;
}
exports.formatBucketToString = formatBucketToString;
