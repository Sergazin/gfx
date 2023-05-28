// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { QueryClientImpl as SpQueryClientImpl } from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/query";
import { getGateWays } from "./gate-ways";

export async function fetchStorageProviders() {
  const gateWays = await getGateWays();
  const spQueryClient = new SpQueryClientImpl(gateWays.protobuf);
  const response = await spQueryClient.StorageProviders();
  return response.sps;
}
