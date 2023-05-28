// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { StorageProvider } from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/types";
import { fetchStorageProviders } from "../../rpc/fetch-storage-providers";
import {gfxPrint} from "@/utils/print";

function formatStorageProvider(sp: StorageProvider, idx: number): string {
  const br = "    ";
  const { operatorAddress, endpoint, status, description } = sp;
  return `\x1b[36m⚙️  Storage Provider #${idx}\x1b[0m
${br}Moniker:          ${description?.moniker}
${br}Endpoint:         ${endpoint}
${br}Status:           ${status == 0 ? "In Service ✅" : "Not in Service ❌"}
${br}Operator addr:    ${operatorAddress}`;
}

export async function listStorageProviders() {
  gfxPrint("Fetching storage providers... ⌛️");
  const providers = await fetchStorageProviders();
  const formattedProviders = providers.map(formatStorageProvider);
  console.log(formattedProviders.join("\n"));
}
