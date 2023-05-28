// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { PubKey } from "@bnb-chain/greenfield-cosmos-types/cosmos/crypto/secp256k1/keys";
import { toBuffer } from "@ethereumjs/util";

export const makeCosmosPublicKey = (pk: string) => {
  const publicKey = PubKey.fromPartial({ key: toBuffer(pk) });

  return {
    typeUrl: "/cosmos.crypto.eth.ethsecp256k1.PubKey",
    value: PubKey.encode(publicKey).finish(),
  };
};
