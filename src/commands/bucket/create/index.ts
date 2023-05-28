// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";
import { getStorageProvider } from "@/rpc/get-selected-storage-provider";
import { KEY } from "@/config";
import { CreateBucketApprovalMessage, visibilityFlags, visibilityTypeMap } from "./types";
import { createBucketTx } from "./tx";
import { gfxPrint } from "@/utils/print";
import { approvalGateway } from "@/rpc/approval-gateway";

export async function createBucket(bucketName: string, flags: Record<string, any>) {
  // Step 1: Bucket name validation ===============================================================================
  if (bucketName.length < 3) program.error("Invalid bucket name: must be at least 3 characters long");

  // Step 2: Visibility flag validation ============================================================================
  const visibility: typeof visibilityFlags[number] = flags.visibility || "private";
  if (visibilityFlags.indexOf(visibility) == -1) {
    program.error(
      `Invalid --visibility flag: "${visibility}" ❌.\n - Allowed flags are: ${visibilityFlags.join(", ")}`
    );
  }

  // Step 3: Get the selected storage provider and print the bucket creation request =================================
  const sp = await getStorageProvider(flags.primarySP);
  gfxPrint(
    `Creating bucket "${bucketName}"... ✳️  🪣 `,
    `  - Visibility: ${visibility}`,
    `  - Storage Provider : ${sp.description?.moniker} [${sp.operatorAddress}]`,
    ""
  );

  // #4 Bucket Creation approval Request ===========================================================================
  gfxPrint("Requesting bucket creation approval... ⏳");

  const signedApprovalMessage = await approvalGateway<CreateBucketApprovalMessage>(
    `${sp.endpoint}/greenfield/admin/v1/get-approval?action=CreateBucket`,
    {
      bucket_name: bucketName,
      creator: KEY.address,
      visibility: visibilityTypeMap[visibility],
      primary_sp_address: sp.operatorAddress,
      primary_sp_approval: {
        expired_height: "0",
        sig: "",
      },
      charged_read_quota: "0",
      payment_address: "",
    }
  );
  gfxPrint("Bucket creation approval received! ✅.");

  // #5 Bucket Creation transaction ================================================================================
  gfxPrint("Create bucket transaction started... ⏭️");
  const tx = await createBucketTx({ msg: signedApprovalMessage });

  // #6 Print the result ==========================================================================================
  gfxPrint(`Bucket ${bucketName} created! 🪣\nTransaction Hash: ${tx.transactionHash}`);
}
