<?php

$allowedOrigins = array_filter(array_map(
  "trim",
  explode(",", getenv("CORS_ALLOWED_ORIGINS") ?: "https://owp-portal-redesign.onrender.com,http://localhost:5173")
));
$requestOrigin = $_SERVER["HTTP_ORIGIN"] ?? "";

if ($requestOrigin && in_array($requestOrigin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: " . $requestOrigin);
  header("Vary: Origin");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "OPTIONS") {
  http_response_code(204);
  exit;
}

$OWP_BASE = "https://owp-api.owp.csus.edu/api/v1/account";
$OWP_GUEST_KEY = getenv("OWP_GUEST_KEY"); // set this in server env, NOT frontend

if (!$OWP_GUEST_KEY) {
  http_response_code(500);
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode(["error" => true, "errorMessage" => "Server missing the: OWP_GUEST_KEY"]);
  exit;
}

// Map incoming path: /api/accountDetails/458860  ->  /accountDetails/458860
$requestUri = $_SERVER["REQUEST_URI"] ?? "/";
$requestPath = parse_url($requestUri, PHP_URL_PATH) ?: "/";
$path = preg_replace('#^/api#', '', $requestPath); // strip /api
$query = isset($_SERVER["QUERY_STRING"]) && $_SERVER["QUERY_STRING"] !== ""
  ? "?" . $_SERVER["QUERY_STRING"]
  : "";
$targetUrl = $OWP_BASE . $path . $query;

// Forward method + body
$method = $_SERVER["REQUEST_METHOD"];
$body = file_get_contents("php://input");

$ch = curl_init($targetUrl);
//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //<-- these lines make an unsafe disable SSL verification in cURL (NOT secure) but for testing
//curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); //<-- these lines make an unsafe disable SSL verification in cURL (NOT secure) but for testing

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CAINFO, __DIR__ . '/../../cacert.pem');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

$responseHeaders = [];
curl_setopt($ch, CURLOPT_HEADERFUNCTION, static function ($curl, $headerLine) use (&$responseHeaders) {
  $length = strlen($headerLine);
  $header = trim($headerLine);

  if ($header === "" || !str_contains($header, ":")) {
    return $length;
  }

  [$name, $value] = explode(":", $header, 2);
  $name = strtolower(trim($name));
  $value = trim($value);

  if (in_array($name, ["content-type", "content-disposition"], true)) {
    $responseHeaders[$name] = $value;
  }

  return $length;
});

curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "owp-guest-key: " . $OWP_GUEST_KEY,
  "Accept: application/json"
]);

if ($method === "POST") {
  // Expect x-www-form-urlencoded from Vue helper
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "owp-guest-key: " . $OWP_GUEST_KEY,
    "Accept: application/json",
    "Content-Type: application/x-www-form-urlencoded"
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$response = curl_exec($ch);
if ($response === false) {
  $err = curl_error($ch);
  http_response_code(502);
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode(["error" => true, "errorMessage" => "Proxy cURL error: " . $err]);
  curl_close($ch);
  exit;
}
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($http);
header("Content-Type: " . ($responseHeaders["content-type"] ?? "application/json; charset=utf-8"));

if (isset($responseHeaders["content-disposition"])) {
  header("Content-Disposition: " . $responseHeaders["content-disposition"]);
}

echo $response;
