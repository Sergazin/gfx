"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
const format_description_1 = require("../../utils/format-description");
const create_1 = require("./create");
const delete_1 = require("./delete");
const head_1 = require("./head");
const ls_1 = require("./ls");
exports.bucket = commander_1.program.command("bucket");
exports.bucket
    .summary(`Bucket operations`.white)
    .showHelpAfterError(true)
    .description((0, format_description_1.formatDescription)("Support the bucket operation functions, including create/update/delete/head/list"));
//  =========================================================================================================
exports.bucket
    .command("create")
    .summary("Create a new bucket".white)
    .description((0, format_description_1.formatDescription)(`Create a new bucket and set a createBucketMsg to storage provider.`, `The bucket name should unique and the default visibility is private. `, `The command need to set the primary SP address with --primarySP. `, "", `Examples: `, `# Create a new bucket called gfx, visibility is public-read `, `$ gfx bucket create --visibility=public-read  gnfd://gnfd-bucket`))
    .option("--visibility <value>", "Set visibility of the bucket", "private")
    .option("--primarySP <value>", "Indicate the primarySP address, using the string type")
    .argument("<name>", "New bucket name".white.bgBlack)
    .showHelpAfterError(true)
    .action(create_1.createBucket);
//  =========================================================================================================
exports.bucket
    .command("delete")
    .argument("<name>", "Bucket name or url for delete".white.bgBlack)
    .summary("Delete an existed bucket".white.bgBlack)
    .description((0, format_description_1.formatDescription)(`Delete an existed bucket and send a deleteBucketMsg to storage provider`))
    .showHelpAfterError(true)
    .action(delete_1.deleteBucket);
//  =========================================================================================================
exports.bucket
    .command("head")
    .summary("Query bucket info.".white)
    .description((0, format_description_1.formatDescription)("Send headBucket txn to chain and fetch bucket info on greenfield chain"))
    .argument("<name>", "Bucket name or url".white.bgBlack)
    .showHelpAfterError(true)
    .action(head_1.bucketHead);
//  =========================================================================================================
exports.bucket
    .command("ls")
    .summary("List buckets".white.bgBlack)
    .option("--primarySpAddress <value>", "Indicate the primarySP address, using the string type".white.bgBlack)
    .showHelpAfterError(true)
    .action(ls_1.listBuckets);
