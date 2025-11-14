<?php
/**
 * Simple PHP History Manager
 * No React, No Inertia - Just Works!
 */

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Section;
use App\Models\SectionRevision;

// Handle restore action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['restore'])) {
    $sectionId = (int) $_POST['section_id'];
    $revisionId = (int) $_POST['revision_id'];
    
    $section = Section::find($sectionId);
    $revision = SectionRevision::find($revisionId);
    
    if ($section && $revision) {
        $section->restoreFromRevision($revisionId);
        $message = "✅ Successfully restored {$section->key} to version from " . $revision->created_at->diffForHumans();
        header("Location: /admin-restore.php?success=" . urlencode($message));
        exit;
    }
}

// Get all sections with revisions
$sections = Section::with(['revisions' => function($q) {
    $q->orderBy('created_at', 'desc');
}])->get();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>History Manager - Simple & Working</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #fff;
            padding: 20px;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; color: #60a5fa; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .stat-card {
            background: rgba(96, 165, 250, 0.1);
            border: 1px solid rgba(96, 165, 250, 0.3);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-number { font-size: 2em; font-weight: bold; color: #60a5fa; }
        .stat-label { color: #9ca3af; font-size: 0.9em; }
        
        .success-message {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        }
        
        .section-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.3s;
        }
        .section-card:hover {
            border-color: rgba(96, 165, 250, 0.5);
            background: rgba(255,255,255,0.08);
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .section-key {
            font-family: 'Courier New', monospace;
            color: #60a5fa;
            font-size: 1.1em;
            font-weight: bold;
        }
        .badge {
            background: rgba(147, 51, 234, 0.3);
            color: #a78bfa;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }
        .current-preview {
            margin: 15px 0;
            padding: 15px;
            background: rgba(0,0,0,0.3);
            border-radius: 8px;
        }
        .current-preview img {
            max-height: 100px;
            border-radius: 8px;
            border: 2px solid rgba(96, 165, 250, 0.3);
        }
        
        .revision-list {
            margin-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 20px;
        }
        .revision-item {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: start;
            transition: all 0.3s;
        }
        .revision-item:hover {
            border-color: rgba(147, 51, 234, 0.5);
            background: rgba(147, 51, 234, 0.1);
        }
        .revision-info { flex: 1; }
        .revision-number {
            background: rgba(147, 51, 234, 0.3);
            color: #a78bfa;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            display: inline-block;
            margin-right: 10px;
        }
        .revision-meta {
            color: #9ca3af;
            font-size: 0.85em;
            margin: 5px 0;
        }
        .revision-preview {
            margin-top: 10px;
        }
        .revision-preview img {
            max-height: 120px;
            border-radius: 6px;
            border: 2px solid rgba(255,255,255,0.2);
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        
        .restore-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            font-size: 0.9em;
        }
        .restore-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
        }
        .restore-btn:active {
            transform: translateY(0);
        }
        
        .btn-back {
            display: inline-block;
            background: rgba(96, 165, 250, 0.2);
            color: #60a5fa;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            margin-bottom: 20px;
            transition: all 0.3s;
        }
        .btn-back:hover {
            background: rgba(96, 165, 250, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/home" class="btn-back">← Back to Homepage</a>
        
        <div class="header">
            <h1>🔄 History Manager</h1>
            <p style="color: #9ca3af; margin-top: 10px;">
                Simple restore tool - View all versions and restore with one click
            </p>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number"><?= $sections->count() ?></div>
                    <div class="stat-label">Total Sections</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= SectionRevision::count() ?></div>
                    <div class="stat-label">Total Backups</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= $sections->filter(fn($s) => $s->revisions->count() > 0)->count() ?></div>
                    <div class="stat-label">Restorable Sections</div>
                </div>
            </div>
        </div>

        <?php if (isset($_GET['success'])): ?>
            <div class="success-message">
                <?= htmlspecialchars($_GET['success']) ?>
                <br><small>Refresh homepage to see changes!</small>
            </div>
        <?php endif; ?>

        <?php foreach ($sections->sortByDesc('updated_at') as $section): ?>
            <?php if ($section->revisions->count() === 0) continue; ?>
            
            <div class="section-card">
                <div class="section-header">
                    <div>
                        <span class="section-key"><?= $section->key ?></span>
                        <span class="badge"><?= $section->revisions->count() ?> versions</span>
                    </div>
                    <div style="color: #9ca3af; font-size: 0.85em;">
                        Updated: <?= $section->updated_at->diffForHumans() ?>
                    </div>
                </div>

                <?php if ($section->image): ?>
                    <div class="current-preview">
                        <p style="color: #9ca3af; font-size: 0.85em; margin-bottom: 10px;">Current:</p>
                        <img src="<?= asset('storage/' . $section->image) ?>?v=<?= time() ?>" alt="Current" loading="lazy">
                        <p style="color: #6b7280; font-size: 0.75em; margin-top: 5px;">
                            <?= basename($section->image) ?>
                        </p>
                    </div>
                <?php endif; ?>

                <div class="revision-list">
                    <h3 style="color: #a78bfa; margin-bottom: 15px;">📜 Version History</h3>
                    
                    <?php foreach ($section->revisions as $idx => $revision): ?>
                        <div class="revision-item">
                            <div class="revision-info">
                                <div>
                                    <span class="revision-number">#<?= $section->revisions->count() - $idx ?></span>
                                    <span style="color: #60a5fa; font-size: 0.9em;"><?= $revision->change_type ?></span>
                                </div>
                                <div class="revision-meta">
                                    📅 <?= $revision->created_at->format('Y-m-d H:i:s') ?>
                                    (<?= $revision->created_at->diffForHumans() ?>)
                                </div>
                                <div class="revision-meta">
                                    👤 <?= $revision->changed_by ?>
                                </div>
                                
                                <?php if ($revision->content): ?>
                                    <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 6px;">
                                        <p style="font-size: 0.85em; color: #d1d5db;">
                                            <?= substr($revision->content, 0, 150) ?>
                                            <?= strlen($revision->content) > 150 ? '...' : '' ?>
                                        </p>
                                    </div>
                                <?php endif; ?>
                                
                                <?php if ($revision->image): ?>
                                    <div class="revision-preview">
                                        <img src="<?= asset('storage/' . $revision->image) ?>?v=<?= time() ?>" alt="Version <?= $idx + 1 ?>" loading="lazy">
                                        <p style="color: #6b7280; font-size: 0.75em; margin-top: 5px;">
                                            <?= basename($revision->image) ?>
                                        </p>
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                            <form method="POST" onsubmit="return confirm('🔄 Restore to this version?\n\nCurrent version will be backed up.');">
                                <input type="hidden" name="section_id" value="<?= $section->id ?>">
                                <input type="hidden" name="revision_id" value="<?= $revision->id ?>">
                                <button type="submit" name="restore" class="restore-btn">
                                    ↺ Restore to This Version
                                </button>
                            </form>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>

        <?php if ($sections->filter(fn($s) => $s->revisions->count() > 0)->count() === 0): ?>
            <div style="text-align: center; padding: 60px; color: #9ca3af;">
                <p style="font-size: 1.5em; margin-bottom: 10px;">📭</p>
                <p>No revision history available yet</p>
                <p style="font-size: 0.9em; margin-top: 10px;">Make some edits to create backups!</p>
            </div>
        <?php endif; ?>
    </div>

    <script>
        // Auto-scroll to success message
        <?php if (isset($_GET['success'])): ?>
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                alert('✅ Restore successful!\n\nGo to homepage to see the restored image.');
            }, 300);
        <?php endif; ?>
    </script>
</body>
</html>

