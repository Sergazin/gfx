"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBucket = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
const get_selected_storage_provider_1 = require("@/rpc/get-selected-storage-provider");
const config_1 = require("@/config");
const types_1 = require("./types");
const tx_1 = require("./tx");
const print_1 = require("@/utils/print");
const approval_gateway_1 = require("@/rpc/approval-gateway");
async function createBucket(bucketName, flags) {
    // Step 1: Bucket name validation ===============================================================================
    if (bucketName.length < 3)
        commander_1.program.error("Invalid bucket name: must be at least 3 characters long");
    // Step 2: Visibility flag validation ============================================================================
    const visibility = flags.visibility || "private";
    if (types_1.visibilityFlags.indexOf(visibility) == -1) {
        commander_1.program.error(`Invalid --visibility flag: "${visibility}" ❌.\n - Allowed flags are: ${types_1.visibilityFlags.join(", ")}`);
    }
    // Step 3: Get the selected storage provider and print the bucket creation request =================================
    const sp = await (0, get_selected_storage_provider_1.getStorageProvider)(flags.primarySP);
    (0, print_1.gfxPrint)(`Creating bucket "${bucketName}"... ✳️  🪣 `, `  - Visibility: ${visibility}`, `  - Storage Provider : ${sp.description?.moniker} [${sp.operatorAddress}]`, "");
    // #4 Bucket Creation approval Request ===========================================================================
    (0, print_1.gfxPrint)("Requesting bucket creation approval... ⏳");
    const signedApprovalMessage = await (0, approval_gateway_1.approvalGateway)(`${sp.endpoint}/greenfield/admin/v1/get-approval?action=CreateBucket`, {
        bucket_name: bucketName,
        creator: config_1.KEY.address,
        visibility: types_1.visibilityTypeMap[visibility],
        primary_sp_address: sp.operatorAddress,
        primary_sp_approval: {
            expired_height: "0",
            sig: "",
        },
        charged_read_quota: "0",
        payment_address: "",
    });
    (0, print_1.gfxPrint)("Bucket creation approval received! ✅.");
    // #5 Bucket Creation transaction ================================================================================
    (0, print_1.gfxPrint)("Create bucket transaction started... ⏭️");
    const tx = await (0, tx_1.createBucketTx)({ msg: signedApprovalMessage });
    // #6 Print the result ==========================================================================================
    (0, print_1.gfxPrint)(`Bucket ${bucketName} created! 🪣\nTransaction Hash: ${tx.transactionHash}`);
}
exports.createBucket = createBucket;
