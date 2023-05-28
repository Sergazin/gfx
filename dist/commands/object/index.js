"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.object = void 0;
// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
const commander_1 = require("commander");
require("./put");
const format_description_1 = require("@/utils/format-description");
const put_1 = require("./put");
const delete_1 = require("./delete");
const cancel_1 = require("./cancel");
const get_1 = require("./get");
const ls_1 = require("./ls");
const head_1 = require("./head");
exports.object = commander_1.program.command("object");
exports.object
    .summary(`Object operations operations`.white.bgBlack)
    .showHelpAfterError(true)
    .description((0, format_description_1.formatDescription)("Support the object operation functions, including put/get/update/delete/head/list"));
exports.object
    .command("put")
    .summary(`Put an object into the bucket`.white.bgBlack)
    .description((0, format_description_1.formatDescription)("Put an object into the bucket"))
    .argument("<filePath>", "The file path of the object")
    .argument("<objectUrl>", "The object url in the bucket")
    .showHelpAfterError(true)
    .action(put_1.putObjectIntoBasket);
exports.object
    .command("get")
    .summary(`Get an object from the bucket`.white.bgBlack)
    .description((0, format_description_1.formatDescription)("Get an object from the bucket"))
    .argument("<objectUrl>", "The object url in the bucket for get")
    .showHelpAfterError(true)
    .action(get_1.getObjectFromBucket);
exports.object
    .command("delete")
    .summary(`Delete an object from the bucket`.white.bgBlack)
    .description((0, format_description_1.formatDescription)("Delete an object from the bucket"))
    .argument("<objectUrl>", "The object url in the bucket for deletion")
    .showHelpAfterError(true)
    .action(delete_1.deleteObjectFromBasket);
exports.object
    .command("cancel")
    .summary(`Cancel an object creation`.white.bgBlack)
    .description((0, format_description_1.formatDescription)("Cancel an object creation"))
    .argument("<objectUrl>", "The object url in the bucket for cancellation")
    .showHelpAfterError(true)
    .action(cancel_1.cancelCreateObject);
exports.object
    .command("ls")
    .summary(`List objects in the bucket`.white.bgBlack)
    .description((0, format_description_1.formatDescription)("List objects in the bucket"))
    .argument("<bucketName>", "The name of the bucket")
    .showHelpAfterError(true)
    .action(ls_1.listObjects);
exports.object
    .command("head")
    .summary(`Head an object in the bucket`.white.bgBlack)
    .description((0, format_description_1.formatDescription)("Head an object in the bucket"))
    .argument("<objectUrl>", "The object url in the bucket")
    .showHelpAfterError(true)
    .action(head_1.headObject);
