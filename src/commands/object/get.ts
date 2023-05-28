// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import fs from "fs";
import { getStorageProvider } from "@/rpc/get-selected-storage-provider";
import { getObjectUrl, parseObjectUrl } from "./utils";
import axios from "axios";
import { config } from "@/config";
import { gfxPrint } from "@/utils/print";

export async function getObjectFromBucket(objectUrl: string) {
  const { bucketName, objectPath } = parseObjectUrl(objectUrl);
  gfxPrint(`Downloading ${objectPath} from ${bucketName}... 🔽`);
  const sp = await getStorageProvider();
  const url = getObjectUrl({ bucketName, objectPath, endpoint: sp.endpoint });
  const result = await axios.get(url, {
    headers: { Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config.mockSignature}` },
  });

  fs.writeFileSync(objectPath, result.data);
  gfxPrint(`Downloaded ${objectPath} from ${bucketName}! ✅`);
}
