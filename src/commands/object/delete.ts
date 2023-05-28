// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { MsgDeleteObject } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx";
import { parseObjectUrl } from "./utils";
import { KEY, config } from "@/config";
import { TxBody } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx";
import { Any } from "@bnb-chain/greenfield-cosmos-types/google/protobuf/any";
import { txBroadcast } from "@/rpc/tx-broadcast";
import { gfxPrint } from "@/utils/print";

export async function deleteObjectFromBasket(objectUrl: string) {
  const { bucketName, objectPath } = parseObjectUrl(objectUrl);
  gfxPrint(`Deleting object "${objectPath}" from "${bucketName}"... ⌛️`);
  const typeUrl = "/greenfield.storage.MsgDeleteObject";

  // Step 1: Create the message and the transaction body

  const objectRemoveMessage: MsgDeleteObject = {
    bucketName,
    objectName: objectPath,
    operator: KEY.address,
  };

  const msg = {
    bucket_name: bucketName,
    object_name: objectPath,
    operator: KEY.address,
    type: typeUrl,
  };

  const bodyBytes = TxBody.encode(
    TxBody.fromPartial({
      messages: [
        Any.fromPartial({
          typeUrl,
          value: MsgDeleteObject.encode(objectRemoveMessage).finish(),
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
        {
          name: "object_name",
          type: "string",
        },
      ],
    },
    chainId: "5600",
  });

  // Step 3: Print the result
  gfxPrint(`Object "${objectPath}" in "${bucketName}" removed! ❌\nTransaction Hash: ${tx.transactionHash}`);
}
