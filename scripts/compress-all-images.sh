#!/usr/bin/env bash
# Compress all images in public/ (smaller file size, same visual quality).
# - JPEG: max dimension 1920px, high quality (q:v 2). Faststart for web.
# - PNG: max dimension 1920px, lossless re-encode with max compression.
# - WEBP: same scale, quality 90.
# Backs up to public/backup-images/full-YYYYMMDD-HHMMSS/ before overwriting.

set -e
cd "$(dirname "$0")/.."
PUBLIC="public"
BACKUP="$PUBLIC/backup-images/full-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP"

echo "Backup dir: $BACKUP"

# Backup: mirror structure (skip backup-images and build)
while IFS= read -r -d '' f; do
  rel="${f#$PUBLIC/}"
  dir="$BACKUP/$(dirname "$rel")"
  mkdir -p "$dir"
  cp "$f" "$BACKUP/$rel"
  echo "Backed up: $rel"
done < <(find "$PUBLIC" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) ! -path "*/backup-images/*" ! -path "*/build/*" -print0)

echo "Backup done. Compressing..."

compress_one() {
  local f="$1"
  local ext="${f##*.}"
  local lower
  lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
  local tmp="${f}.compress.$$"
  local scale="scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease"

  if [[ "$lower" == "jpg" || "$lower" == "jpeg" ]]; then
    ffmpeg -y -i "$f" -vf "$scale" -q:v 2 -movflags +faststart "$tmp" 2>/dev/null && mv "$tmp" "$f"
  elif [[ "$lower" == "png" ]]; then
    ffmpeg -y -i "$f" -vf "$scale" -compression_level 9 "$tmp" 2>/dev/null && mv "$tmp" "$f"
  elif [[ "$lower" == "webp" ]]; then
    ffmpeg -y -i "$f" -vf "$scale" -quality 90 -lossless 0 "$tmp" 2>/dev/null && mv "$tmp" "$f"
  fi
  rm -f "$tmp"
}

count=0
while IFS= read -r -d '' f; do
  compress_one "$f"
  count=$((count+1))
  echo "[$count] $f"
done < <(find "$PUBLIC" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) ! -path "*/backup-images/*" ! -path "*/build/*" -print0)

echo "Done. Compressed $count files. Originals in $BACKUP"
