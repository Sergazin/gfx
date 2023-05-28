// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { StorageProvider } from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/types";
import { fetchStorageProviders } from "../../rpc/fetch-storage-providers";
import { program } from "commander";
import { gfxPrint } from "@/utils/print";

export async function headStorageProvider(endpoint: string) {
  const providers = await fetchStorageProviders();
  const found = providers.find((p) => p.endpoint === endpoint);
  if (!found) program.error(`Storage Provider ${endpoint} not found ❌`);
  gfxPrint(formatStorageProvider(found));
}

function formatStorageProvider(storageProvider: StorageProvider): string {
  const formattedObject: Record<string, any> = {
    "👤 Operator Address": storageProvider.operatorAddress,
    "💰 Funding Address": storageProvider.fundingAddress,
    "🔒 Seal Address": storageProvider.sealAddress,
    "✅ Approval Address": storageProvider.approvalAddress,
    "🗑️  GC Address": storageProvider.gcAddress,
    "💸 Total Deposit": storageProvider.totalDeposit,
    "🟢 Status": storageProvider.status,
    "🔗 Endpoint": storageProvider.endpoint,
    "📝 Description": JSON.stringify(storageProvider.description),
  };

  let formattedString = "";
  for (const key in formattedObject) {
    formattedString += `${key.cyan}: ` + `${formattedObject[key]}`.white.bgBlack + `\n`;
  }

  return `${storageProvider.description?.moniker.yellow}\n${formattedString}`;
}
