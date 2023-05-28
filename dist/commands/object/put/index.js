"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putObjectIntoBasket = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../../../config");
const get_selected_storage_provider_1 = require("../../../rpc/get-selected-storage-provider");
const get_file_hash_1 = require("./get-file-hash");
const approval_gateway_1 = require("../../../rpc/approval-gateway");
const print_1 = require("../../../utils/print");
const create_tx_1 = require("./create-tx");
const utils_1 = require("../utils");
const upload_1 = require("./upload");
async function putObjectIntoBasket(filePath, objectUrl) {
    const { bucketName, objectPath } = (0, utils_1.parseObjectUrl)(objectUrl);
    const realPath = path_1.default.resolve(filePath);
    const sp = await (0, get_selected_storage_provider_1.getStorageProvider)();
    const { hashArray, contentLength } = (0, get_file_hash_1.getFileHashArray)(realPath);
    (0, print_1.gfxPrint)("Requesting object creation approval... ⏳");
    const approvalMessage = await (0, approval_gateway_1.approvalGateway)(`${sp.endpoint}/greenfield/admin/v1/get-approval?action=CreateObject`, {
        bucket_name: bucketName,
        creator: config_1.KEY.address,
        object_name: objectPath,
        content_type: "application/octet-stream",
        payload_size: contentLength.toString(),
        visibility: "VISIBILITY_TYPE_PRIVATE",
        primary_sp_approval: { expired_height: "0", sig: "" },
        expect_checksums: hashArray || [],
        redundancy_type: "REDUNDANCY_EC_TYPE",
        expect_secondary_sp_addresses: await (0, get_selected_storage_provider_1.getSecondaryProviders)(sp.operatorAddress),
    });
    (0, print_1.gfxPrint)("Object creation approval received! ✅.");
    (0, print_1.gfxPrint)("Create object transaction started... ⏭️");
    const createdObjectTxResp = await (0, create_tx_1.createObjectTx)(approvalMessage);
    (0, print_1.gfxPrint)("Start uploading object... ⏭️");
    await (0, upload_1.upload)((0, utils_1.getObjectUrl)({ bucketName, objectPath, endpoint: sp.endpoint }), createdObjectTxResp.transactionHash, new Blob([fs_1.default.readFileSync(realPath)]));
    (0, print_1.gfxPrint)("Object uploaded! ✅");
}
exports.putObjectIntoBasket = putObjectIntoBasket;
