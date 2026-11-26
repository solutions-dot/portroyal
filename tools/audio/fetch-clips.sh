#!/bin/sh
# Download recorded clips. stdin lines: <game> <stem> <url>. Saves games/<game>/site/voices/narrator-<stem>.mp3 and prints its length.
while read g stem url; do
  d=games/$g/site/voices; mkdir -p $d
  curl -sS -L --fail -o $d/narrator-$stem.mp3 "$url" && printf '%s %s %s\n' "$g" "$stem" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 $d/narrator-$stem.mp3)"
done
