// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import "colors";

export function formatDescription(...msg: string[]) {
  // format description for better readability
  const pattern = "\n   ";
  return "Description:\n".yellow + pattern + msg.join(pattern).white.bgBlack;
}
