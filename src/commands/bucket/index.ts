// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";
import { formatDescription } from "@/utils/format-description";

import { createBucket } from "./create";
import { deleteBucket } from "./delete";
import { bucketHead } from "./head";
import { listBuckets } from "./ls";

export const bucket = program.command("bucket");

bucket
  .summary(`Bucket operations`.white)
  .showHelpAfterError(true)
  .description(
    formatDescription("Support the bucket operation functions, including create/update/delete/head/list")
  );
//  =========================================================================================================
bucket
  .command("create")
  .summary("Create a new bucket".white)
  .description(
    formatDescription(
      `Create a new bucket and set a createBucketMsg to storage provider.`,
      `The bucket name should unique and the default visibility is private. `,
      `The command need to set the primary SP address with --primarySP. `,
      "",
      `Examples: `,
      `# Create a new bucket called gfx, visibility is public-read `,
      `$ gfx bucket create --visibility=public-read  gnfd://gnfd-bucket`
    )
  )
  .option("--visibility <value>", "Set visibility of the bucket", "private")
  .option("--primarySP <value>", "Indicate the primarySP address, using the string type")
  .argument("<name>", "New bucket name".white.bgBlack)
  .showHelpAfterError(true)
  .action(createBucket);
//  =========================================================================================================
bucket
  .command("delete")
  .argument("<name>", "Bucket name or url for delete".white.bgBlack)
  .summary("Delete an existed bucket".white.bgBlack)
  .description(formatDescription(`Delete an existed bucket and send a deleteBucketMsg to storage provider`))
  .showHelpAfterError(true)
  .action(deleteBucket);
//  =========================================================================================================
bucket
  .command("head")
  .summary("Query bucket info.".white)
  .description(formatDescription("Send headBucket txn to chain and fetch bucket info on greenfield chain"))
  .argument("<name>", "Bucket name or url".white.bgBlack)
  .showHelpAfterError(true)
  .action(bucketHead);
//  =========================================================================================================
bucket
  .command("ls")
  .summary("List buckets".white.bgBlack)
  .option("--primarySpAddress <value>", "Indicate the primarySP address, using the string type".white.bgBlack)
  .showHelpAfterError(true)
  .action(listBuckets);
