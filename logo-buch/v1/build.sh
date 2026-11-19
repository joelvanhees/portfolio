#!/bin/sh
# Wraps the artifact fragment into a standalone page (index.html) for local viewing / hosting.
cd "$(dirname "$0")"
{ printf '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style>\n'; cat artifact.html; printf '\n</html>\n'; } > index.html
