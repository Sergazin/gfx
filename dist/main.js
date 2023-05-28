#!/usr/bin/env node -r ts-node/register/transpile-only -r tsconfig-paths/register
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
require("colors");
const welcome_1 = require("./visual/welcome");
commander_1.program.name("gfx").description(welcome_1.welcomeText).version("0.0.1");
require("./commands");
commander_1.program.parse();
commander_1.program.showHelpAfterError(true);
