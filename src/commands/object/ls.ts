// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { getStorageProvider } from "@/rpc/get-selected-storage-provider";
import { getObjectUrl } from "./utils";
import axios from "axios";
import { config } from "@/config";
import { gfxPrint } from "@/utils/print";
import {VisibilityType} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

export async function listObjects(bucketName: string) {
  const sp = await getStorageProvider();
  const url = getObjectUrl({ bucketName, endpoint: sp.endpoint });
  const result = await axios.get(url, {
    headers: { Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config.mockSignature}` },
  });
  const objects: GFObject[] = result.data.objects;

  const formatted = objects.filter(v=>!v.removed).map(formatObjectToString);
  gfxPrint(...formatted);
}

export type GFObject = {
  object_info: {
    owner: "0xf58E1Ad63FE22B551Cd488439Df94EA0de985C36";
    bucket_name: "www17";
    object_name: "xx2.txt";
    id: "32025";
    payload_size: "1480";
    visibility: 2;
    content_type: "application/octet-stream";
    create_at: "1685253383";
    object_status: 1;
    redundancy_type: 0;
    source_type: 0;
  };
  locked_balance: "0x0000000000000000000000000000000000000000000000000000000000000000";
  removed: true;
  update_at: "93561";
  delete_at: "0";
  delete_reason: "";
  operator: "0x674d969927AbA4eE9Cd05e5079655BB099D83d85";
  create_tx_hash: "0x70dba9da1b148ce570c8a705e51fd1d84102a40ead74d1c31b51457a64a9cf58";
  update_tx_hash: "0x26f869e65dff3ad23e5287cd7818766fb8dcd85f38c40ce31bded8b178e79907";
  seal_tx_hash: "0x52b3e99a5d89bbb25b79e7111251e5706608797b23383bfd2c24c74f0a7be1eb";
};

function formatObjectToString(object: GFObject): string {
  const formattedObject: Record<string, any> = {
    "📄 Object Name": object.object_info.object_name,
    "    🆔 ID": object.object_info.id,
    "    📦 Payload Size": object.object_info.payload_size,
    "    🔒 Visibility": VisibilityType[object.object_info.visibility],
    "    📋 Object Status": object.object_info.object_status,
  };

  let formattedString = "";
  for (const key in formattedObject) {
    formattedString += `${key.cyan}: ` + `${formattedObject[key]}`.white.bgBlack + `\n`;
  }

  return formattedString;
}
