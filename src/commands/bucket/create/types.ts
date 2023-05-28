// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

export type CreateBucketApprovalMessage = {
  creator: string;
  bucket_name: string;
  visibility: keyof typeof VisibilityType;
  payment_address: string;
  primary_sp_address: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
  };
  charged_read_quota: string;
};

export const createBucketMessageTypes = {
  Msg: [
    { name: "type", type: "string" },
    { name: "creator", type: "string" },
    { name: "bucket_name", type: "string" },
    { name: "visibility", type: "string" },
    { name: "payment_address", type: "string" },
    { name: "primary_sp_address", type: "string" },
    { name: "primary_sp_approval", type: "TypePrimarySpApproval" },
    { name: "charged_read_quota", type: "uint64" },
  ],
  TypePrimarySpApproval: [
    { name: "expired_height", type: "uint64" },
    { name: "sig", type: "bytes" },
  ],
};

export const visibilityFlags = ["public-read", "private", "inherit"] as const;

export const visibilityTypeMap: Record<typeof visibilityFlags[number], keyof typeof VisibilityType> = {
  "public-read": "VISIBILITY_TYPE_PUBLIC_READ",
  private: "VISIBILITY_TYPE_PRIVATE",
  inherit: "VISIBILITY_TYPE_INHERIT",
};
