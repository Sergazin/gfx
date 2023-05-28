// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";
import { listStorageProviders } from "./ls";
import { headStorageProvider } from "./head";

const sp = program.command("sp");
sp.summary("Storage Provider operations".white.bgBlack);

sp.command("ls")
  .summary("List storage providers info".white.bgBlack)
  .showHelpAfterError(true)
  .action(listStorageProviders);

sp.command("head")
  .summary("Get storage provider details")
  .argument("<endpoint>", "Storage Provider endpoint".white.bgBlack)
  .showHelpAfterError(true)
  .action(headStorageProvider);
