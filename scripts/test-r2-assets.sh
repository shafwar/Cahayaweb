#!/bin/bash

# Script to test R2 asset accessibility
# This helps verify if files exist in R2 bucket with correct paths

R2_BASE_URL="https://assets.cahayaanbiya.com"

# Test images
echo "=== Testing Image Assets ==="
IMAGES=(
    "arabsaudi.jpg"
    "TURKEY.jpeg"
    "egypt.jpeg"
    "dubai1.jpeg"
    "jordan.jpeg"
    "oman.jpg"
    "qatar.jpg"
    "kuwait.jpg"
    "bahrain.jpg"
    "umrah.jpeg"
)

for img in "${IMAGES[@]}"; do
    echo -n "Testing $img... "
    
    # Try multiple path variations
    PATHS=(
        "$R2_BASE_URL/public/images/$img"
        "$R2_BASE_URL/images/$img"
        "$R2_BASE_URL/$img"
    )
    
    FOUND=false
    for path in "${PATHS[@]}"; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$path" 2>/dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✓ FOUND at: $path"
            FOUND=true
            break
        fi
    done
    
    if [ "$FOUND" = false ]; then
        echo "✗ NOT FOUND (tried all variations)"
    fi
done

# Test videos
echo ""
echo "=== Testing Video Assets ==="
VIDEOS=(
    "b2cherosectionvideo.mp4"
)

for vid in "${VIDEOS[@]}"; do
    echo -n "Testing $vid... "
    
    # Try multiple path variations
    PATHS=(
        "$R2_BASE_URL/public/videos/$vid"
        "$R2_BASE_URL/videos/$vid"
        "$R2_BASE_URL/$vid"
    )
    
    FOUND=false
    for path in "${PATHS[@]}"; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$path" 2>/dev/null)
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✓ FOUND at: $path"
            FOUND=true
            break
        fi
    done
    
    if [ "$FOUND" = false ]; then
        echo "✗ NOT FOUND (tried all variations)"
    fi
done

echo ""
echo "=== Test Complete ==="
echo "If files are NOT FOUND, you need to:"
echo "1. Upload files to R2 bucket"
echo "2. Ensure custom domain is configured correctly"
echo "3. Check CORS settings in R2 dashboard"
