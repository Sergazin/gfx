# GFX (Green Field eXecutor)

### Author: Arman Sergazin <arman@sergazin.kz>

---

### Requirements:

- nodejs (v18.9.0 Tested)
- npm (8.19.1 Tested)

### Installation

```
git clone https://github.com/sergazin/gfx
cd gfx
npm i
npm run build
npm run prepare
alias gfx="$PWD/dist/main.js"
```

### Create key

`gfx key-store // then follow instruction`

### Usage

```
gfx <command>

Commands:
  bucket          Bucket operations
  object          Object operations operations
  sp              Storage Provider operations
  key-store       Key Store utility
```

## Examples

```
# Create Bucket
gfx bucket create mybucket
```

Output:

```
Creating bucket "mybucket"... ✳️  🪣
  - Visibility: private
  - Storage Provider : Titan [0xB573F5c174f33aF0CA033c8A287061C1538fb130]

Requesting bucket creation approval... ⏳
Bucket creation approval received! ✅.
Create bucket transaction started... ⏭️
Tx Simation Success ✅: gasLimit: 2400, gasPrice: 5000000000
Bucket mybucket created! 🪣
Transaction Hash: F1E2EAF640494BE3B5060DF12345BE8E0145486B82731E295B14F91D75D1F9B7
```

### List Buckets

`gfx bucket ls`

### Show Bucket info

`gfx bucket head mybucket`

### Put an object into the bucket

`gfx object put hello.txt gnfd://mybucket/hello.txt`

### Download Object

`gfx object get gnfd://mybucket/hello.txt`

### List bucket objects

`gfx object ls mybucket`

### Show object info

`gfx object head gnfd://mybucket/hello.txt`

### Cancel object creation ( If not uploaded yet )

`gfx object cancel gnfd://mybucket/hello.txt`

### Delete object ( If uploaded )

`gfx object delete gnfd://mybucket/hello.txt`

### Delete Bucket

`gfx bucket delete mybucket`

### List storage providers

`gfx sp ls`

### Show SP info

`gfx sp head https://gnfd-testnet-sp-5.bnbchain.org`

```
(The MIT License)

Copyright (c) 2023 Arman Sergazin <arman@sergazin.kz>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```
