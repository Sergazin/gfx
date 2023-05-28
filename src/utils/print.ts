// Copyright 2023 Arman Sergazin. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
export function gfxPrint(...msg: string[]) {
  // Purpose: Provides a function to print a message to the console for better customization.
  console.log(msg.join("\n"), "");
}
