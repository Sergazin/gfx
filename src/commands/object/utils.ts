// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import { program } from "commander";

export function parseObjectUrl(objectUrl: string) {
  const regex = /^gnfd:\/\/([^/]+)\/(.+)$/;
  const match = objectUrl.match(regex);
  if (!match) program.error("Invalid object url");
  const [_, bucketName, objectPath] = match;
  return {
    bucketName,
    objectPath,
  };
}

export function getObjectUrl(opts: { bucketName: string; objectPath?: string; endpoint: string }) {
  const { bucketName, objectPath, endpoint } = opts;
  return `https://${bucketName}.${endpoint.replace("https://", "")}${objectPath ? "/" + objectPath : ""}`;
}
