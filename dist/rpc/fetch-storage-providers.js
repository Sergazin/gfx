"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStorageProviders = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const query_1 = require("@bnb-chain/greenfield-cosmos-types/greenfield/sp/query");
const gate_ways_1 = require("./gate-ways");
async function fetchStorageProviders() {
    const gateWays = await (0, gate_ways_1.getGateWays)();
    const spQueryClient = new query_1.QueryClientImpl(gateWays.protobuf);
    const response = await spQueryClient.StorageProviders();
    return response.sps;
}
exports.fetchStorageProviders = fetchStorageProviders;
