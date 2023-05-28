// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import fs from "fs";
import { program } from "commander";
import readline from "readline";
import keythereum from "keythereum";
import { gfxFolderPath } from "@/config";
import { gfxPrint } from "@/utils/print";

const sp = program.command("key-store");

sp.summary("Key Store utility".white.bgBlack)
  .showHelpAfterError(true)
  .action(() => {
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    gfxPrint("Welcome to GFX Key Store Utility 🔑");
    gfxPrint("This utility will help you to create a key.json file and password.txt file for your key storage.");
    gfxPrint("Old files will be overwritten.");

    /**
    const privateKey = "bd375af84f8a41d8941d1be506b7d94c59d5df2f476952c442cacbefd4475b30";
    const password = "Qweqwe1!";
    * */

    input.question("Enter private key string: ", (privateKey) => {
      input.question("Enter password: ", (password) => {
        const dk = keythereum.create({ keyBytes: 32, ivBytes: 16 });

        const keyObject = keythereum.dump(
          Buffer.from(password, "utf8"),
          // @ts-expect-error TODO: fix keythereum types
          privateKey,
          dk.salt,
          dk.iv,
          {}
        );

        fs.writeFileSync(`${gfxFolderPath}/key.json`, JSON.stringify(keyObject, null, 2));
        gfxPrint("Key saved to: ", `${gfxFolderPath}/key.json`);
        fs.writeFileSync(`${gfxFolderPath}/password.txt`, password, "utf8");
        gfxPrint("Password saved to: ", `${gfxFolderPath}/password.txt`);
      });
    });
  });
