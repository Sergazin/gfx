// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { BaseAccount } from "@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth";
import { Coin } from "@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin";
import { makeAuthInfoBytes } from "@cosmjs/proto-signing";

export function getAuthInfoBytes(params: {
  pubKey: BaseAccount["pubKey"];
  sequence: string;
  gasLimit: number;
  gasPrice: string;
  denom: string;
}) {
  const { pubKey, denom, sequence, gasLimit, gasPrice } = params;
  if (!pubKey) throw new Error("pubKey is required");

  const feeAmount: Coin[] = [{ denom, amount: String(BigInt(gasLimit) * BigInt(gasPrice)) }];
  const feeGranter = undefined;
  const feePayer = undefined;
  const authInfoBytes = makeAuthInfoBytes(
    [{ pubkey: pubKey, sequence: Number(sequence) }],
    feeAmount,
    gasLimit,
    feeGranter,
    feePayer,
    712
  );

  return authInfoBytes;
}
