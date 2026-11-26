#!/bin/sh
# prints "200 <id>" when the Cartesia link answers (used by fetch-film.mjs to repair a mistyped id)
curl -s -o /dev/null -w "%{http_code} $1\n" -I "https://files.cartesia.ai/link/link_$1" | grep '^200' || true
