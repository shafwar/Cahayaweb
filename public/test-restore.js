// Test Restore Functionality
// Paste this in browser console to test

console.clear();
console.log('='.repeat(60));
console.log('🔬 RESTORE FUNCTION TEST');
console.log('='.repeat(60));

async function testRestore() {
    try {
        // Step 1: Check current image
        console.log('\n1️⃣  Checking current image in database...');
        const currentResponse = await fetch('/admin/revisions?key=home.hero.1.image&limit=1');
        const currentData = await currentResponse.json();
        console.log('   Current revision:', currentData.revisions?.[0] || 'No revisions');

        // Step 2: Get latest revision to restore
        console.log('\n2️⃣  Getting revision to restore...');
        const revisions = currentData.revisions || [];
        if (revisions.length === 0) {
            console.error('   ❌ No revisions available!');
            alert('No revisions to restore. Upload an image first!');
            return;
        }

        const revisionId = revisions[0].id;
        console.log('   Will restore revision ID:', revisionId);

        // Step 3: Execute restore
        console.log('\n3️⃣  Executing restore...');
        const restoreResponse = await fetch('/admin/restore-revision', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                key: 'home.hero.1.image',
                revision_id: revisionId
            })
        });

        const restoreData = await restoreResponse.json();
        console.log('   Restore response:', restoreData);

        if (restoreData.status === 'ok') {
            console.log('\n4️⃣  ✅ Restore successful!');
            console.log('   Database updated to previous version');
            console.log('   Reloading page with cache bust...');
            
            // Force reload with cache bust
            setTimeout(() => {
                window.location.href = window.location.href.split('?')[0] + '?cacheBust=' + Date.now();
            }, 1000);
        } else {
            console.error('   ❌ Restore failed:', restoreData);
            alert('Restore failed: ' + (restoreData.message || 'Unknown error'));
        }

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        alert('Test error: ' + error.message);
    }
}

// Run test
console.log('\n🚀 Starting test in 2 seconds...');
console.log('   (Make sure you are logged in as admin!)');
setTimeout(() => {
    testRestore();
}, 2000);

