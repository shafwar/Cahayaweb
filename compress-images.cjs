const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const fs = require('fs');
const path = require('path');

async function compressImages() {
    console.log('🚀 Starting image compression...');

    // Create optimized directory
    const optimizedDir = 'public/optimized';
    if (!fs.existsSync(optimizedDir)) {
        fs.mkdirSync(optimizedDir, { recursive: true });
    }

    // Compress JPEG images to WebP
    console.log('📸 Compressing JPEG images to WebP...');
    const jpegFiles = await imagemin(['public/*.{jpg,jpeg}'], {
        destination: optimizedDir,
        plugins: [
            imageminWebp({
                quality: 80,
                method: 6,
            }),
        ],
    });

    // Compress PNG images to WebP
    console.log('🖼️ Compressing PNG images to WebP...');
    const pngFiles = await imagemin(['public/*.png'], {
        destination: optimizedDir,
        plugins: [
            imageminWebp({
                quality: 85,
                method: 6,
            }),
        ],
    });

    // Also create compressed JPEG versions for fallback
    console.log('🔄 Creating compressed JPEG fallbacks...');
    const jpegFallbacks = await imagemin(['public/*.{jpg,jpeg}'], {
        destination: optimizedDir,
        plugins: [
            imageminMozjpeg({
                quality: 80,
                progressive: true,
            }),
        ],
    });

    // Create compressed PNG versions for fallback
    console.log('🔄 Creating compressed PNG fallbacks...');
    const pngFallbacks = await imagemin(['public/*.png'], {
        destination: optimizedDir,
        plugins: [
            imageminPngquant({
                quality: [0.6, 0.8],
                speed: 1,
            }),
        ],
    });

    console.log('✅ Image compression completed!');
    console.log(`📊 Compressed ${jpegFiles.length + pngFiles.length} images`);

    // Show file size comparison
    console.log('\n📈 File size comparison:');
    const originalFiles = fs.readdirSync('public').filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    originalFiles.forEach((file) => {
        const originalPath = path.join('public', file);
        const originalSize = fs.statSync(originalPath).size;

        const webpFile = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const webpPath = path.join(optimizedDir, webpFile);

        if (fs.existsSync(webpPath)) {
            const webpSize = fs.statSync(webpPath).size;
            const reduction = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);
            console.log(`${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);
        }
    });
}

compressImages().catch(console.error);
