<?php
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

header("Access-Control-Allow-Origin: https://owp-portal-redesign.onrender.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($path === "/api" || str_starts_with($path, "/api/")) {
  require __DIR__ . "/src/api/index.php";
  exit;
}

$file = __DIR__ . $path;
if ($path !== "/" && file_exists($file)) return false;

http_response_code(404);
header("Content-Type: text/plain; charset=utf-8");
echo "Not found";