// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { resolve } from "path";
import { spawnSync } from "child_process";

export const getFileHashArray = (filePath: string) => {
  const wasmExecNodePath = resolve(__dirname, "./wasm/run.js");
  const proc = spawnSync("node", [wasmExecNodePath, filePath]);
  return JSON.parse(proc.stdout.toString()) as { hashArray: string[]; contentLength: number };
};
