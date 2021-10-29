#!/bin/sh

# TODO execute this instead when nx is implemented
#   AFFECTED="$(npx nx affected:apps --plain)"

AFFECTED="frontend e2e-tests"
FOUND=false

IFS=' ' read -ra PACKAGE <<< "$AFFECTED"
for pkg in "${PACKAGE[@]}"; do
  if [ $pkg == $1 ]; then
    FOUND=true
    break
  fi
done

echo $FOUND
