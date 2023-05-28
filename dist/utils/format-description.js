"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDescription = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
require("colors");
function formatDescription(...msg) {
    // format description for better readability
    const pattern = "\n   ";
    return "Description:\n".yellow + pattern + msg.join(pattern).white.bgBlack;
}
exports.formatDescription = formatDescription;
