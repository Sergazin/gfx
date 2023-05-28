// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import axios from "axios";
import { KEY, config } from "@/config";

export async function upload(endpoint: string, txnHash: string, file: Blob) {
  const response = await axios.put(endpoint, file, {
    headers: {
      Authorization: `authTypeV2 ECDSA-secp256k1, Signature=${config.mockSignature}`,
      "X-Gnfd-Txn-hash": txnHash,
      "X-Gnfd-User-Address": KEY.address,
    },
  });
  return response;
}
