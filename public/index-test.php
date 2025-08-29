<?php
echo "PHP is working on Railway!";
echo "<br>PHP Version: " . PHP_VERSION;
echo "<br>Current time: " . date('Y-m-d H:i:s');
echo "<br>Server: " . $_SERVER['SERVER_SOFTWARE'] ?? 'unknown';
echo "<br>Document Root: " . $_SERVER['DOCUMENT_ROOT'] ?? 'unknown';
echo "<br>Script Name: " . $_SERVER['SCRIPT_NAME'] ?? 'unknown';
?>
