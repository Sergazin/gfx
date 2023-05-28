// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import keythereum from "keythereum";
import { KEY, config } from "@/config";
export function getPrivateKey() {
  // @ts-expect-error DefinitelyTyped not updated yet
  const privateKey: Buffer = keythereum.recover(config.password, KEY);
  return `0x${privateKey.toString("utf8")}`;
}
