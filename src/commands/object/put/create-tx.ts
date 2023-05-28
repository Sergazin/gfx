// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import {
  redundancyTypeFromJSON,
  visibilityTypeFromJSON,
} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import Long from "long";
import { KEY, config } from "@/config";
import { bytesFromBase64 } from "@bnb-chain/greenfield-cosmos-types/helpers";
import { Any } from "@bnb-chain/greenfield-cosmos-types/google/protobuf/any";
import { TxBody } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx";
import { txBroadcast } from "@/rpc/tx-broadcast";
import { CreateObjectApprovalMessage, createObjectMessageTypes } from "./types";
import { MsgCreateObject } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx";

export async function createObjectTx(msg: CreateObjectApprovalMessage) {
  // Message type URL
  const typeUrl = "/greenfield.storage.MsgCreateObject";

  // Create the object creation message
  const objectCreationMessage: MsgCreateObject = {
    creator: msg.creator,
    bucketName: msg.bucket_name,
    objectName: msg.object_name,
    payloadSize: Long.fromString(msg.payload_size),
    visibility: visibilityTypeFromJSON(msg.visibility),
    contentType: msg.content_type,
    primarySpApproval: {
      expiredHeight: Long.fromString(msg.primary_sp_approval.expired_height),
      sig: bytesFromBase64(msg.primary_sp_approval.sig),
    },
    expectChecksums: msg.expect_checksums.map((e: string) => bytesFromBase64(e)),
    redundancyType:
      msg.redundancy_type === undefined ? redundancyTypeFromJSON(0) : redundancyTypeFromJSON(msg.redundancy_type),
    expectSecondarySpAddresses: msg.expect_secondary_sp_addresses,
  };

  // Encode the transaction body
  const bodyBytes = TxBody.encode(
    TxBody.fromPartial({
      messages: [
        Any.fromPartial({
          typeUrl,
          value: MsgCreateObject.encode(objectCreationMessage).finish(),
        }),
      ],
    })
  ).finish();

  // Broadcast the transaction
  const resp = await txBroadcast({
    key: KEY,
    bodyBytes,
    msg: { ...msg, type: typeUrl },
    msgTypes: createObjectMessageTypes,
    chainId: "5600",
    denom: config.defaultDenom,
  });


  return resp;
}
