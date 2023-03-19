#!/bin/bash

cd ./public

USER=Bytelv
REPO=Myblog
VER=main
files=$(find * -type f ! -path "freecdn-*" ! -name ".*")
list=""

for file in $files; do
  hash=$(openssl dgst -sha256 -binary "$file" | openssl base64 -A)
  list="$list
$hash https://blog.lvbyte.top/$file
$hash https://cdn.jsdelivr.net/gh/$USER/$REPO@$VER/$file"
done

freecdn db --import <<< "$list"
freecdn find --save
freecdn manifest --sign
freecdn js --make
