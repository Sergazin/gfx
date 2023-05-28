// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { visibilityTypeFromJSON } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import { MsgCreateBucket } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx";
import Long from "long";
import { KEY, config } from "@/config";
import { CreateBucketApprovalMessage, createBucketMessageTypes } from "./types";
import { bytesFromBase64 } from "@bnb-chain/greenfield-cosmos-types/helpers";
import { Any } from "@bnb-chain/greenfield-cosmos-types/google/protobuf/any";
import { TxBody } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx";
import { txBroadcast } from "@/rpc/tx-broadcast";

export async function createBucketTx({ msg }: { msg: CreateBucketApprovalMessage }) {
  // Message type URL
  const typeUrl = "/greenfield.storage.MsgCreateBucket";

  // Create the bucket creation message
  const bucketCreationMessage: MsgCreateBucket = {
    creator: msg.creator,
    bucketName: msg.bucket_name,
    visibility: visibilityTypeFromJSON(msg.visibility),
    primarySpAddress: msg.primary_sp_address,
    primarySpApproval: {
      expiredHeight: Long.fromString(msg.primary_sp_approval.expired_height),
      sig: bytesFromBase64(msg.primary_sp_approval.sig),
    },
    chargedReadQuota: msg.charged_read_quota ? Long.fromString("0") : Long.fromString(msg.charged_read_quota),
    paymentAddress: "",
  };

  // Encode the transaction body
  const bodyBytes = TxBody.encode(
    TxBody.fromPartial({
      messages: [
        Any.fromPartial({
          typeUrl,
          value: MsgCreateBucket.encode(bucketCreationMessage).finish(),
        }),
      ],
    })
  ).finish();

  // Broadcast the transaction
  const resp = await txBroadcast({
    key: KEY,
    bodyBytes,
    msg: { ...msg, type: typeUrl },
    msgTypes: createBucketMessageTypes,
    chainId: "5600",
    denom: config.defaultDenom,
  });

  return resp;
}
