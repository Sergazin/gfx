#!/usr/bin/env node -r ts-node/register/transpile-only -r tsconfig-paths/register
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";
import "colors";
import { welcomeText } from "./visual/welcome";

program.name("gfx").description(welcomeText).version("0.0.1");
import "./commands";
program.parse();
program.showHelpAfterError(true);
