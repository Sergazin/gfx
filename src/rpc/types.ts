// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import type { ProtobufRpcClient } from "@cosmjs/stargate";
import { QueryClient, StargateClient } from "@cosmjs/stargate";
import type ExtensionTypes from "@cosmjs/stargate/build/modules";
import type { AuthzExtension } from "@cosmjs/stargate/build/modules/authz/queries";
import { MessageTypes } from "@metamask/eth-sig-util";

export const coreMessageTypes: MessageTypes = {
  Coin: [
    { name: "denom", type: "string" },
    { name: "amount", type: "uint256" },
  ],
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "string" },
    { name: "salt", type: "string" },
  ],
  Tx: [
    { name: "account_number", type: "uint256" },
    { name: "chain_id", type: "uint256" },
    { name: "fee", type: "Fee" },
    { name: "memo", type: "string" },
    { name: "msg", type: "Msg" },
    { name: "sequence", type: "uint256" },
    { name: "timeout_height", type: "uint256" },
  ],
  Fee: [
    { name: "amount", type: "Coin[]" },
    { name: "gas_limit", type: "uint256" },
    { name: "payer", type: "string" },
    { name: "granter", type: "string" },
  ],
  TypeAmount: [
    { name: "denom", type: "string" },
    { name: "amount", type: "string" },
  ],
};

// This is a type definition for the gateways we will use to connect to the blockchain.
export type GFXGateWays = {
  protobuf: ProtobufRpcClient;
  stargate: StargateClient;
  query: QueryClient &
    AuthzExtension &
    ExtensionTypes.AuthExtension &
    ExtensionTypes.BankExtension &
    ExtensionTypes.DistributionExtension &
    ExtensionTypes.FeegrantExtension &
    ExtensionTypes.GovExtension &
    ExtensionTypes.IbcExtension &
    ExtensionTypes.MintExtension &
    ExtensionTypes.SlashingExtension &
    ExtensionTypes.StakingExtension &
    ExtensionTypes.TxExtension;
  approval: <T>(endpoint: string, message: T) => Promise<NonNullable<T>>;
};
