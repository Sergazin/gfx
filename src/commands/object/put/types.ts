// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { RedundancyType, VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

export type CreateObjectApprovalMessage = {
  creator: string;
  bucket_name: string;
  object_name: string;
  payload_size: string;
  visibility: keyof typeof VisibilityType;
  content_type: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
  };
  expect_checksums: string[];
  expect_secondary_sp_addresses: string[];
  redundancy_type: keyof typeof RedundancyType;
  // charged_read_quota: string;
};

export const createObjectMessageTypes = {
  Msg: [
    {
      name: "type",
      type: "string",
    },
    {
      name: "creator",
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
    {
      name: "payload_size",
      type: "uint64",
    },
    {
      name: "visibility",
      type: "string",
    },
    {
      name: "content_type",
      type: "string",
    },
    {
      name: "primary_sp_approval",
      type: "TypePrimarySpApproval",
    },
    {
      name: "expect_checksums",
      type: "bytes[]",
    },
    {
      name: "redundancy_type",
      type: "string",
    },
    {
      name: "expect_secondary_sp_addresses",
      type: "string[]",
    },
  ],
  TypePrimarySpApproval: [
    {
      name: "expired_height",
      type: "uint64",
    },
    {
      name: "sig",
      type: "bytes",
    },
  ],
};
