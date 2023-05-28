"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectFromBucket = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const fs_1 = __importDefault(require("fs"));
const get_selected_storage_provider_1 = require("@/rpc/get-selected-storage-provider");
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@/config");
const print_1 = require("@/utils/print");
async function getObjectFromBucket(objectUrl) {
    const { bucketName, objectPath } = (0, utils_1.parseObjectUrl)(objectUrl);
    (0, print_1.gfxPrint)(`Downloading ${objectPath} from ${bucketName}... 🔽`);
    const sp = await (0, get_selected_storage_provider_1.getStorageProvider)();
    const url = (0, utils_1.getObjectUrl)({ bucketName, objectPath, endpoint: sp.endpoint });
    const result = await axios_1.default.get(url, {
        headers: { Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config_1.config.mockSignature}` },
    });
    fs_1.default.writeFileSync(objectPath, result.data);
    (0, print_1.gfxPrint)(`Downloaded ${objectPath} from ${bucketName}! ✅`);
}
exports.getObjectFromBucket = getObjectFromBucket;
