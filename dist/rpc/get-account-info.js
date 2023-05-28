"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountInfo = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const gate_ways_1 = require("./gate-ways");
const auth_1 = require("@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth");
async function getAccountInfo(address) {
    const gateWays = await (0, gate_ways_1.getGateWays)();
    const account = await gateWays.query.auth.account(address);
    const accountInfo = account ? auth_1.BaseAccount.decode(account.value) : auth_1.BaseAccount.fromJSON({});
    return accountInfo;
}
exports.getAccountInfo = getAccountInfo;
