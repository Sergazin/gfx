"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGateWays = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const stargate_1 = require("@cosmjs/stargate");
const extensions = __importStar(require("@cosmjs/stargate"));
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const config_1 = require("../config");
const approval_gateway_1 = require("./approval-gateway");
let gateWays;
async function getGateWays() {
    // Cuz we only need one rpc client instance, and it defines asynchrony, so we use singleton pattern here.
    if (gateWays)
        return gateWays;
    // Create a tendermint client instance.
    const tendermintClientInstance = await tendermint_rpc_1.Tendermint37Client.connect(config_1.config.rpcEndpoint);
    // Create a query client instance.
    const queryClient = stargate_1.QueryClient.withExtensions(tendermintClientInstance, 
    // Extensions
    extensions.setupAuthExtension, extensions.setupAuthzExtension, extensions.setupBankExtension, extensions.setupDistributionExtension, extensions.setupFeegrantExtension, extensions.setupGovExtension, extensions.setupIbcExtension, extensions.setupMintExtension, extensions.setupSlashingExtension, extensions.setupStakingExtension, extensions.setupTxExtension);
    // Create a protobuf rpc client instance.
    const rpcClientInstance = (0, stargate_1.createProtobufRpcClient)(new stargate_1.QueryClient(tendermintClientInstance));
    // Create a stargate client instance.
    const stargateClientInstance = await stargate_1.StargateClient.create(tendermintClientInstance);
    return {
        protobuf: rpcClientInstance,
        stargate: stargateClientInstance,
        query: queryClient,
        approval: approval_gateway_1.approvalGateway,
    };
}
exports.getGateWays = getGateWays;
