// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import axios from "axios";
import { config } from "@/config";
import { decodeObjectFromHexString, encodeObjectToHexString } from "@/utils/object-to-hex-string-encode-decode";
import { program } from "commander";

export async function approvalGateway<T>(endpoint: string, message: T) {
  const response = await axios.get(endpoint, {
    headers: {
      Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config.mockSignature}`,
      "X-Gnfd-Unsigned-Msg": encodeObjectToHexString(message),
    },
  });
  const encodedSignedMessage = response.headers["x-gnfd-signed-msg"];
  const signedApprovalMessage: T = decodeObjectFromHexString(encodedSignedMessage);
  if (!signedApprovalMessage) program.error("Approval error ❌");

  return signedApprovalMessage;
}
