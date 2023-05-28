"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileHashArray = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const path_1 = require("path");
const child_process_1 = require("child_process");
const getFileHashArray = (filePath) => {
    const wasmExecNodePath = (0, path_1.resolve)(__dirname, "./wasm/run.js");
    const proc = (0, child_process_1.spawnSync)("node", [wasmExecNodePath, filePath]);
    return JSON.parse(proc.stdout.toString());
};
exports.getFileHashArray = getFileHashArray;
