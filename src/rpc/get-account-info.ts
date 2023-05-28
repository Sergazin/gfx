// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { getGateWays } from "@/rpc/gate-ways";
import { BaseAccount } from "@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth";

export async function getAccountInfo(address: string) {
  const gateWays = await getGateWays();
  const account = await gateWays.query.auth.account(address);
  const accountInfo = account ? BaseAccount.decode(account.value) : BaseAccount.fromJSON({});
  return accountInfo;
}
