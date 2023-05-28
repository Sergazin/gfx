// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { KEY, config } from "@/config";
import { TxBody } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx";
import { Any } from "@bnb-chain/greenfield-cosmos-types/google/protobuf/any";
import { MsgDeleteBucket } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx";
import { txBroadcast } from "@/rpc/tx-broadcast";
import { gfxPrint } from "@/utils/print";

export async function deleteBucket(bucketName: string) {
  // Step 0: Prepare
  if (bucketName.startsWith("gnfd://")) bucketName = bucketName.slice(7);
  gfxPrint(`Delete bucket "${bucketName}"⛔️. Starting... ⌛️`);
  const typeUrl = "/greenfield.storage.MsgDeleteBucket";

  // Step 1: Create the message and the transaction body

  const bucketRemoveMessage: MsgDeleteBucket = {
    bucketName,
    operator: KEY.address,
  };

  const msg = {
    bucket_name: bucketName,
    operator: KEY.address,
    type: typeUrl,
  };

  const bodyBytes = TxBody.encode(
    TxBody.fromPartial({
      messages: [
        Any.fromPartial({
          typeUrl,
          value: MsgDeleteBucket.encode(bucketRemoveMessage).finish(),
        }),
      ],
    })
  ).finish();

  // Step 2: Broadcast the transaction
  const tx = await txBroadcast({
    key: KEY,
    denom: config.defaultDenom,
    bodyBytes,
    msg,
    msgTypes: {
      Msg: [
        {
          name: "type",
          type: "string",
        },
        {
          name: "operator",
          type: "string",
        },
        {
          name: "bucket_name",
          type: "string",
        },
      ],
    },
    chainId: "5600",
  });

  // Step 3: Print the result
  gfxPrint(`Bucket "${bucketName}" removed! ❌🪣\nTransaction Hash: ${tx.transactionHash}`);
}
