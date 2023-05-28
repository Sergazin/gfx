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
exports.rpcGateway = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const axios_1 = __importStar(require("axios"));
const config_1 = require("../config");
class RPCGateway {
    constructor(endpoint) {
        this.endpoint = endpoint || config_1.config.rpcEndpoint;
    }
    async get(method) {
        const { endpoint } = this;
        const url = `${endpoint}/greenfield/admin/v1/${method}`;
        try {
            console.log("POST:", url);
            const resp = await axios_1.default.get(url);
            console.log(`RPC Response ${url}:\n`, resp.data);
            return resp.data;
        }
        catch (e) {
            if (e instanceof axios_1.AxiosError) {
                console.log(`RPC Response:\n`, e.response?.data);
            }
            else {
                console.log(e);
            }
        }
    }
}
exports.rpcGateway = new RPCGateway(config_1.config.rpcEndpoint);
