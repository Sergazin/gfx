// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import fs from "fs";
import path from "path";
import { KEY } from "@/config";
import { getSecondaryProviders, getStorageProvider } from "@/rpc/get-selected-storage-provider";
import { getFileHashArray } from "./get-file-hash";
import { approvalGateway } from "@/rpc/approval-gateway";
import { CreateObjectApprovalMessage } from "./types";
import { gfxPrint } from "@/utils/print";
import { createObjectTx } from "./create-tx";
import { getObjectUrl, parseObjectUrl } from "../utils";
import { upload } from "./upload";

export async function putObjectIntoBasket(filePath: string, objectUrl: string) {
  const { bucketName, objectPath } = parseObjectUrl(objectUrl);

  const realPath = path.resolve(filePath);

  const sp = await getStorageProvider();

  const { hashArray, contentLength } = getFileHashArray(realPath);

  gfxPrint("Requesting object creation approval... ⏳");

  const approvalMessage = await approvalGateway<CreateObjectApprovalMessage>(
    `${sp.endpoint}/greenfield/admin/v1/get-approval?action=CreateObject`,
    {
      bucket_name: bucketName,
      creator: KEY.address,
      object_name: objectPath,
      content_type: "application/octet-stream",
      payload_size: contentLength.toString(),
      visibility: "VISIBILITY_TYPE_PRIVATE",
      primary_sp_approval: { expired_height: "0", sig: "" },
      expect_checksums: hashArray || [],
      redundancy_type: "REDUNDANCY_EC_TYPE",
      expect_secondary_sp_addresses: await getSecondaryProviders(sp.operatorAddress),
    }
  );
  gfxPrint("Object creation approval received! ✅.");

  gfxPrint("Create object transaction started... ⏭️");

  const createdObjectTxResp = await createObjectTx(approvalMessage);

  gfxPrint("Start uploading object... ⏭️");

  await upload(
    getObjectUrl({ bucketName, objectPath, endpoint: sp.endpoint }),
    createdObjectTxResp.transactionHash,
    new Blob([fs.readFileSync(realPath)])
  );

  gfxPrint("Object uploaded! ✅");
}
