// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { getGateWays } from "@/rpc/gate-ways";
import { BaseAccount } from "@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth";
import { ServiceClientImpl, SimulateRequest } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service";
import { getAuthInfoBytes } from "./get-auth-info-bytes";
import { makeCosmosPublicKey } from "@/utils/cosmos/make-cosmos-public-key";
import { config } from "@/config";
import { AuthInfo, Tx, TxBody } from "@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx";
import { program } from "commander";

export async function txSimulate(opts: { accountInfo: BaseAccount; bodyBytes: Uint8Array; denom: string }) {
  const gateWays = await getGateWays();
  const { accountInfo, bodyBytes, denom } = opts;
  const rpc = new ServiceClientImpl(gateWays.protobuf);

  const authInfoBytes = getAuthInfoBytes({
    denom,
    sequence: accountInfo.sequence + "",
    gasLimit: 0,
    gasPrice: "0",
    pubKey: makeCosmosPublicKey(config.zeroPubkey),
  });

  const tx = Tx.fromPartial({
    authInfo: AuthInfo.decode(authInfoBytes),
    body: TxBody.decode(bodyBytes),
    signatures: [Uint8Array.from([])],
  });

  try {
    const simulateTxResult = await rpc.Simulate(SimulateRequest.fromPartial({ txBytes: Tx.encode(tx).finish() }));
    if (!simulateTxResult.gasInfo) throw new Error("Simulate failed ❌: gasInfo is undefined");
    return {
      gasLimit: simulateTxResult.gasInfo?.gasUsed.toNumber(),
      gasPrice: simulateTxResult.gasInfo?.minGasPrice.replace(denom, ""),
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("Bucket already exists")) {
        program.error(`Simulate failed ❌: Bucket already exists`);
      } else if (e.message.includes("Object already exists")) {
        program.error(`Simulate failed ❌: Object already exists`);
      } else program.error(`Simulate failed ❌: ${e.message}`);
    } else program.error(`Simulate failed ❌: ${e}`);
  }
}
