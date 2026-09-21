#!/bin/zsh
set -u

PROJECT_ROOT="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

if [[ -x "$PROJECT_ROOT/commands/open-demo.command" ]]; then
  exec "$PROJECT_ROOT/commands/open-demo.command"
fi
if [[ -f "$PROJECT_ROOT/index.html" ]]; then
  open "$PROJECT_ROOT/index.html"
  exit $?
fi
open "$PROJECT_ROOT"
