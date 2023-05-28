"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketHead = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const print_1 = require("@/utils/print");
const gate_ways_1 = require("@/rpc/gate-ways");
const query_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/query");
const commander_1 = require("commander");
const common_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/storage/common");
async function bucketHead(bucketName) {
    if (bucketName.startsWith("gnfd://"))
        bucketName = bucketName.slice(7);
    (0, print_1.gfxPrint)(`Requesting bucket "${bucketName}"... ⏳ 🪣`.yellow);
    const gateWays = await (0, gate_ways_1.getGateWays)();
    const spQueryClient = new query_1.QueryClientImpl(gateWays.protobuf);
    const { bucketInfo } = await spQueryClient.HeadBucket({
        bucketName,
    });
    if (!bucketInfo)
        commander_1.program.error(`Bucket "${bucketName}" not found ❌.`);
    console.log(formatBucketInfoToString(bucketInfo));
}
exports.bucketHead = bucketHead;
function formatBucketInfoToString(bucketInfo) {
    const formattedObject = {
        "🆔 ID": bucketInfo.id,
        "👤 Owner": bucketInfo.owner,
        "📁 Bucket name": bucketInfo.bucketName,
        "🔒 Visibility": common_1.VisibilityType[bucketInfo.visibility],
        "🌐 Source Type": bucketInfo.sourceType,
        "⏰ Create TimeStamp": bucketInfo.createAt,
        "💰 Payment Address": bucketInfo.paymentAddress,
        "🏢 Primary Sp Address": bucketInfo.primarySpAddress,
        "📊 Charged read quota": bucketInfo.chargedReadQuota,
        "💳 Billing info": bucketInfo.billingInfo,
        "📋 Bucket status": bucketInfo.bucketStatus,
    };
    let formattedString = "";
    for (const key in formattedObject) {
        formattedString += `${key.cyan}: ` + `${formattedObject[key]}`.white.bgBlack + `\n`;
    }
    return formattedString;
}
