// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { bufferToHex, toBuffer } from "@ethereumjs/util";
import { publicKeyCreate } from "ethereum-cryptography/secp256k1-compat";
import { makeCosmosPublicKey } from "./make-cosmos-public-key";

export async function privateKeyToCosmosPublicKey(privateKey: string) {
  const privateKeyBytes = toBuffer(privateKey);
  const publicKeyBytes = publicKeyCreate(privateKeyBytes);
  const publicKeyString = bufferToHex(toBuffer(publicKeyBytes));
  const cosmosPublicKey = makeCosmosPublicKey(publicKeyString);
  return cosmosPublicKey;
}
