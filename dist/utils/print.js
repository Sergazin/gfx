"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gfxPrint = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
function gfxPrint(...msg) {
    // Purpose: Provides a function to print a message to the console for better customization.
    console.log(msg.join("\n"), "");
}
exports.gfxPrint = gfxPrint;
