// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { getStorageProvider } from "@/rpc/get-selected-storage-provider";
import { getObjectUrl, parseObjectUrl } from "./utils";
import axios from "axios";
import { config } from "@/config";
import { gfxPrint } from "@/utils/print";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import { GFObject } from "./ls";

function formatObjectToString(object: GFObject): string {
  const formattedObject: Record<string, any> = {
    "👤 Owner": object.object_info.owner,
    "📁 Bucket Name": object.object_info.bucket_name,
    "📄 Object Name": object.object_info.object_name,
    "🆔 ID": object.object_info.id,
    "📦 Payload Size": object.object_info.payload_size,
    "🔒 Visibility": VisibilityType[object.object_info.visibility],
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

export async function headObject(objectUrl: string) {
  const { bucketName, objectPath } = parseObjectUrl(objectUrl);
  const sp = await getStorageProvider();
  const url = getObjectUrl({ bucketName, endpoint: sp.endpoint });
  const result = await axios.get(url, {
    headers: { Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config.mockSignature}` },
  });
  const objects: GFObject[] = result.data.objects;

  const found = objects.find((v) => v.object_info.object_name === objectPath);
  gfxPrint(found ? formatObjectToString(found) : "Object not found");
}
