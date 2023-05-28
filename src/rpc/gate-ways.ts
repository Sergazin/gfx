// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { QueryClient, StargateClient, createProtobufRpcClient } from "@cosmjs/stargate";
import * as extensions from "@cosmjs/stargate";
import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import { config } from "../config";
import { GFXGateWays } from "./types";
import { approvalGateway } from "./approval-gateway";

let gateWays: GFXGateWays | undefined;

export async function getGateWays(): Promise<GFXGateWays> {
  // Cuz we only need one rpc client instance, and it defines asynchrony, so we use singleton pattern here.
  if (gateWays) return gateWays;

  // Create a tendermint client instance.
  const tendermintClientInstance = await Tendermint37Client.connect(config.rpcEndpoint);

  // Create a query client instance.
  const queryClient = QueryClient.withExtensions(
    tendermintClientInstance,
    // Extensions
    extensions.setupAuthExtension,
    extensions.setupAuthzExtension,
    extensions.setupBankExtension,
    extensions.setupDistributionExtension,
    extensions.setupFeegrantExtension,
    extensions.setupGovExtension,
    extensions.setupIbcExtension,
    extensions.setupMintExtension,
    extensions.setupSlashingExtension,
    extensions.setupStakingExtension,
    extensions.setupTxExtension
  );

  // Create a protobuf rpc client instance.
  const rpcClientInstance = createProtobufRpcClient(new QueryClient(tendermintClientInstance));

  // Create a stargate client instance.
  const stargateClientInstance = await StargateClient.create(tendermintClientInstance);

  return {
    protobuf: rpcClientInstance,
    stargate: stargateClientInstance,
    query: queryClient,
    approval: approvalGateway,
  };
}
