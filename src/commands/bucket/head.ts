// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { gfxPrint } from "@/utils/print";
import { getGateWays } from "@/rpc/gate-ways";
import { QueryClientImpl as BucketQueryClientImpl } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/query";
import { program } from "commander";
import { BucketInfo } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/types";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

export async function bucketHead(bucketName: string) {
  if(bucketName.startsWith("gnfd://")) bucketName = bucketName.slice(7);
  gfxPrint(`Requesting bucket "${bucketName}"... ⏳ 🪣`.yellow);

  const gateWays = await getGateWays();
  const spQueryClient = new BucketQueryClientImpl(gateWays.protobuf);
  const { bucketInfo } = await spQueryClient.HeadBucket({
    bucketName,
  });

  if (!bucketInfo) program.error(`Bucket "${bucketName}" not found ❌.`);

  console.log(formatBucketInfoToString(bucketInfo));
}

function formatBucketInfoToString(bucketInfo: BucketInfo): string {
  const formattedObject: Record<string, any> = {
    "🆔 ID": bucketInfo.id,
    "👤 Owner": bucketInfo.owner,
    "📁 Bucket name": bucketInfo.bucketName,
    "🔒 Visibility": VisibilityType[bucketInfo.visibility],
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
