"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectUrl = exports.parseObjectUrl = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
function parseObjectUrl(objectUrl) {
    const regex = /^gnfd:\/\/([^/]+)\/(.+)$/;
    const match = objectUrl.match(regex);
    if (!match)
        commander_1.program.error("Invalid object url");
    const [_, bucketName, objectPath] = match;
    return {
        bucketName,
        objectPath,
    };
}
exports.parseObjectUrl = parseObjectUrl;
function getObjectUrl(opts) {
    const { bucketName, objectPath, endpoint } = opts;
    return `https://${bucketName}.${endpoint.replace("https://", "")}${objectPath ? "/" + objectPath : ""}`;
}
exports.getObjectUrl = getObjectUrl;
