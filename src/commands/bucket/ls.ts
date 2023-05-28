// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { KEY, config } from "@/config";
import { getStorageProvider } from "@/rpc/get-selected-storage-provider";
import axios from "axios";
import { gfxPrint } from "@/utils/print";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

export async function listBuckets(flags: Record<string, any>) {
  const walletAddress = KEY.address;

  gfxPrint(`Requesting bucket list... ⏳`, ` - Wallet address 💳: ${walletAddress}`, "");

  const sp = await getStorageProvider(flags.primarySpAddress);

  const response = await axios.get<{ buckets: Bucket[] }>(sp.endpoint, {
    headers: {
      Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config.mockSignature}`,
      "X-Gnfd-User-Address": walletAddress,
    },
  });

  const formatted = response.data.buckets.filter((b) => !b.removed).map(formatBucketToString);
  gfxPrint(...formatted);
}

export function formatBucketToString(bucket: Bucket): string {
  const { bucket_name, visibility, id } = bucket.bucket_info;

  const formattedBucket = `🪣  ${bucket_name} [ID: ${id}]
    - Visibility: ${VisibilityType[visibility]}
`;

  return formattedBucket;
}

export type Bucket = {
  bucket_info: {
    owner: string;
    bucket_name: string;
    visibility: number;
    id: string;
    source_type: string;
    create_at: string;
    payment_address: string;
    primary_sp_address: string;
    charged_read_quota: string;
    billing_info: {
      price_time: string;
      total_charge_size: string;
      secondary_sp_objects_size: Array<string>;
    };
    bucket_status: number;
  };
  removed: boolean;
  delete_at: string;
  delete_reason: string;
  operator: string;
  create_tx_hash: string;
  update_tx_hash: string;
  update_at: string;
  update_time: string;
};
