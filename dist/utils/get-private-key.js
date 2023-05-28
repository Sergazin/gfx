"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateKey = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const keythereum_1 = __importDefault(require("keythereum"));
const config_1 = require("@/config");
function getPrivateKey() {
    // @ts-expect-error DefinitelyTyped not updated yet
    const privateKey = keythereum_1.default.recover(config_1.config.password, config_1.KEY);
    return `0x${privateKey.toString("utf8")}`;
}
exports.getPrivateKey = getPrivateKey;
