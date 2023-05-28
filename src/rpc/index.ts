// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import axios, { AxiosError } from "axios";
import { config } from "../config";


class RPCGateway {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint || config.rpcEndpoint;
  }

  async get(method: string) {
    const { endpoint } = this;
    const url = `${endpoint}/greenfield/admin/v1/${method}`;

    try {
      console.log("POST:", url);
      const resp = await axios.get(url);
      console.log(`RPC Response ${url}:\n`, resp.data);
      return resp.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(`RPC Response:\n`, e.response?.data);
      } else {
        console.log(e);
      }
    }
  }
}

export const rpcGateway = new RPCGateway(config.rpcEndpoint);
