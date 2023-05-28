"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.headObject = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const get_selected_storage_provider_1 = require("../../rpc/get-selected-storage-provider");
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const print_1 = require("../../utils/print");
const common_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/common");
function formatObjectToString(object) {
    const formattedObject = {
        "👤 Owner": object.object_info.owner,
        "📁 Bucket Name": object.object_info.bucket_name,
        "📄 Object Name": object.object_info.object_name,
        "🆔 ID": object.object_info.id,
        "📦 Payload Size": object.object_info.payload_size,
        "🔒 Visibility": common_1.VisibilityType[object.object_info.visibility],
        "🔖 Content Type": object.object_info.content_type,
        "⏰ Created At": object.object_info.create_at,
        "📋 Object Status": object.object_info.object_status,
        "🔄 Redundancy Type": object.object_info.redundancy_type,
        "🌐 Source Type": object.object_info.source_type,
        "🔒 Locked Balance": object.locked_balance,
        "❌ Removed": object.removed,
        "🔄 Update At": object.update_at,
        "🗑️ Delete At": object.delete_at,
        "🔑 Operator": object.operator,
        "📝 Create Tx Hash": object.create_tx_hash,
        "📝 Update Tx Hash": object.update_tx_hash,
        "📝 Seal Tx Hash": object.seal_tx_hash,
    };
    let formattedString = "";
    for (const key in formattedObject) {
        formattedString += `${key.cyan}: ` + `${formattedObject[key]}`.white.bgBlack + `\n`;
    }
    return formattedString;
}
async function headObject(objectUrl) {
    const { bucketName, objectPath } = (0, utils_1.parseObjectUrl)(objectUrl);
    const sp = await (0, get_selected_storage_provider_1.getStorageProvider)();
    const url = (0, utils_1.getObjectUrl)({ bucketName, endpoint: sp.endpoint });
    const result = await axios_1.default.get(url, {
        headers: { Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config_1.config.mockSignature}` },
    });
    const objects = result.data.objects;
    const found = objects.find((v) => v.object_info.object_name === objectPath);
    (0, print_1.gfxPrint)(found ? formatObjectToString(found) : "Object not found");
}
exports.headObject = headObject;
