#!/usr/bin/env bash
# Compress ONLY images used on B2C Home page (hero + bestsellers + new + highlights).
# - In-place: compress in public/ so files are smaller, quality preserved (q:v 2 JPEG, compression_level 9 PNG).
# - Optimized copies: write to public/optimized/ for lighter delivery (webp + _optimized.jpg).
# Ensures 4G/slow signal can load home without blocking; quality remains HD.

set -e
cd "$(dirname "$0")/.."
PUBLIC="public"
OPTIMIZED="$PUBLIC/optimized"
BACKUP="$PUBLIC/backup-images/home-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OPTIMIZED" "$BACKUP"

# Exact list of images referenced on home (hero + destinationCahayaPool + newDestinations + highlights)
HOME_IMAGES=(
	"Destination Cahaya.jpeg"
	"Destination Cahaya 1.jpeg"
	"Destination Cahaya 2.jpeg"
	"Destination Cahaya 3.jpeg"
	"Destination Cahaya 4.jpeg"
	"Destination Cahaya 5.jpeg"
	"Destination Cahaya 6.jpeg"
	"Destination Cahaya 7.jpeg"
	"Destination Cahaya 8.jpeg"
	"umrah.jpeg"
	"arabsaudi.jpg"
	"TURKEY.jpeg"
	"oman.jpg"
	"qatar.jpg"
	"kuwait.jpg"
	"bahrain.jpg"
	"dubai1.jpeg"
	"egypt.jpeg"
	"jordan.jpeg"
)

scale_filter="scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease"

compress_one() {
	local f="$1"
	local ext="${f##*.}"
	local lower
	lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
	local tmp="${f}.tmp.$$"
	local base
	base="$(basename "$f" ".$ext")"
	base="${base%.*}"

	if [[ "$lower" == "jpg" || "$lower" == "jpeg" ]]; then
		ffmpeg -y -i "$f" -vf "$scale_filter" -q:v 2 -movflags +faststart "$tmp" 2>/dev/null && mv "$tmp" "$f"
	elif [[ "$lower" == "png" ]]; then
		ffmpeg -y -i "$f" -vf "$scale_filter" -compression_level 9 "$tmp" 2>/dev/null && mv "$tmp" "$f"
	fi
	rm -f "$tmp"
}

# Write optimized version to public/optimized/ (smaller for sections)
write_optimized() {
	local f="$1"
	local ext="${f##*.}"
	local lower
	lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
	local base
	base="$(basename "$f" ".$ext")"
	base="${base%.*}"
	local out_jpg="$OPTIMIZED/${base}_optimized.jpg"
	local out_webp="$OPTIMIZED/${base}.webp"

	if [[ "$lower" == "jpg" || "$lower" == "jpeg" ]]; then
		ffmpeg -y -i "$f" -vf "$scale_filter" -q:v 3 -movflags +faststart "$out_jpg" 2>/dev/null || true
		ffmpeg -y -i "$f" -vf "$scale_filter" -quality 88 -lossless 0 "$out_webp" 2>/dev/null || true
	elif [[ "$lower" == "png" ]]; then
		ffmpeg -y -i "$f" -vf "$scale_filter" -q:v 3 "$out_jpg" 2>/dev/null || true
		ffmpeg -y -i "$f" -vf "$scale_filter" -quality 90 -lossless 0 "$out_webp" 2>/dev/null || true
	fi
}

echo "Backup dir: $BACKUP"
mkdir -p "$BACKUP"
for name in "${HOME_IMAGES[@]}"; do
	path="$PUBLIC/$name"
	[[ -f "$path" ]] || continue
	cp "$path" "$BACKUP/$name"
	echo "Backed up: $name"
done

echo "Compressing in place (public/)..."
for name in "${HOME_IMAGES[@]}"; do
	path="$PUBLIC/$name"
	[[ -f "$path" ]] || continue
	compress_one "$path"
	echo "  compressed: $name"
done

echo "Writing optimized copies (public/optimized/)..."
for name in "${HOME_IMAGES[@]}"; do
	path="$PUBLIC/$name"
	[[ -f "$path" ]] || continue
	write_optimized "$path"
	echo "  optimized: $name"
done

echo "Done. Home images compressed in place + optimized copies in $OPTIMIZED. Originals in $BACKUP."
