"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const fs_1 = __importDefault(require("fs"));
const commander_1 = require("commander");
const readline_1 = __importDefault(require("readline"));
const keythereum_1 = __importDefault(require("keythereum"));
const config_1 = require("@/config");
const print_1 = require("@/utils/print");
const sp = commander_1.program.command("key-store");
sp.summary("Key Store utility".white.bgBlack)
    .showHelpAfterError(true)
    .action(() => {
    const input = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    (0, print_1.gfxPrint)("Welcome to GFX Key Store Utility 🔑");
    (0, print_1.gfxPrint)("This utility will help you to create a key.json file and password.txt file for your key storage.");
    (0, print_1.gfxPrint)("Old files will be overwritten.");
    /**
    const privateKey = "bd375af84f8a41d8941d1be506b7d94c59d5df2f476952c442cacbefd4475b30";
    const password = "Qweqwe1!";
    * */
    input.question("Enter private key string: ", (privateKey) => {
        input.question("Enter password: ", (password) => {
            const dk = keythereum_1.default.create({ keyBytes: 32, ivBytes: 16 });
            const keyObject = keythereum_1.default.dump(Buffer.from(password, "utf8"), 
            // @ts-expect-error TODO: fix keythereum types
            privateKey, dk.salt, dk.iv, {});
            fs_1.default.writeFileSync(`${config_1.gfxFolderPath}/key.json`, JSON.stringify(keyObject, null, 2));
            (0, print_1.gfxPrint)("Key saved to: ", `${config_1.gfxFolderPath}/key.json`);
            fs_1.default.writeFileSync(`${config_1.gfxFolderPath}/password.txt`, password, "utf8");
            (0, print_1.gfxPrint)("Password saved to: ", `${config_1.gfxFolderPath}/password.txt`);
        });
    });
});
