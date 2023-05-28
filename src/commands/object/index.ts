// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";
import "./put";
import { formatDescription } from "@/utils/format-description";
import { putObjectIntoBasket } from "./put";
import { deleteObjectFromBasket } from "./delete";
import { cancelCreateObject } from "./cancel";
import { getObjectFromBucket } from "./get";
import { listObjects } from "./ls";
import {headObject} from "./head";

export const object = program.command("object");

object
  .summary(`Object operations operations`.white.bgBlack)
  .showHelpAfterError(true)
  .description(
    formatDescription("Support the object operation functions, including put/get/update/delete/head/list")
  );

object
  .command("put")
  .summary(`Put an object into the bucket`.white.bgBlack)
  .description(formatDescription("Put an object into the bucket"))
  .argument("<filePath>", "The file path of the object")
  .argument("<objectUrl>", "The object url in the bucket")
  .showHelpAfterError(true)
  .action(putObjectIntoBasket);

object
  .command("get")
  .summary(`Get an object from the bucket`.white.bgBlack)
  .description(formatDescription("Get an object from the bucket"))
  .argument("<objectUrl>", "The object url in the bucket for get")
  .showHelpAfterError(true)
  .action(getObjectFromBucket);

object
  .command("delete")
  .summary(`Delete an object from the bucket`.white.bgBlack)
  .description(formatDescription("Delete an object from the bucket"))
  .argument("<objectUrl>", "The object url in the bucket for deletion")
  .showHelpAfterError(true)
  .action(deleteObjectFromBasket);

object
  .command("cancel")
  .summary(`Cancel an object creation`.white.bgBlack)
  .description(formatDescription("Cancel an object creation"))
  .argument("<objectUrl>", "The object url in the bucket for cancellation")
  .showHelpAfterError(true)
  .action(cancelCreateObject);

object
  .command("ls")
  .summary(`List objects in the bucket`.white.bgBlack)
  .description(formatDescription("List objects in the bucket"))
  .argument("<bucketName>", "The name of the bucket")
  .showHelpAfterError(true)
  .action(listObjects);

object
  .command("head")
  .summary(`Head an object in the bucket`.white.bgBlack)
  .description(formatDescription("Head an object in the bucket"))
  .argument("<objectUrl>", "The object url in the bucket")
  .showHelpAfterError(true)
  .action(headObject);
