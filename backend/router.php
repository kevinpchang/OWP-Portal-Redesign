<?php
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($path === "/api" || str_starts_with($path, "/api/")) {
  require __DIR__ . "/src/api/index.php";
  exit;
}

$file = __DIR__ . $path;
if ($path !== "/" && file_exists($file)) return false;

http_response_code(404);
header("Content-Type: text/plain; charset=utf-8");
echo "Not found";