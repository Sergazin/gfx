"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
const ls_1 = require("./ls");
const head_1 = require("./head");
const sp = commander_1.program.command("sp");
sp.summary("Storage Provider operations".white.bgBlack);
sp.command("ls")
    .summary("List storage providers info".white.bgBlack)
    .showHelpAfterError(true)
    .action(ls_1.listStorageProviders);
sp.command("head")
    .summary("Get storage provider details")
    .argument("<endpoint>", "Storage Provider endpoint".white.bgBlack)
    .showHelpAfterError(true)
    .action(head_1.headStorageProvider);
