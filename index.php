<?php
echo "Cahayaweb is running!";
echo "<br>Port: " . ($_ENV['PORT'] ?? '8000');
echo "<br>Time: " . date('Y-m-d H:i:s');
?>
