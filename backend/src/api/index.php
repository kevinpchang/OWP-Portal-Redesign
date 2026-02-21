<?php

header("Content-Type: application/json; charset=utf-8");

$OWP_BASE = "https://owp-api.owp.csus.edu/api/v1/account";
$OWP_GUEST_KEY = getenv("OWP_GUEST_KEY"); // set this in server env, NOT frontend

if (!$OWP_GUEST_KEY) {
  http_response_code(500);
  echo json_encode(["error" => true, "errorMessage" => "Server missing the: OWP_GUEST_KEY"]);
  exit;
}

// Map incoming path: /api/accountDetails/458860  ->  /accountDetails/458860
$path = $_SERVER["REQUEST_URI"];
$path = preg_replace('#^/api#', '', $path); // strip /api
$targetUrl = $OWP_BASE . $path;

// Forward method + body
$method = $_SERVER["REQUEST_METHOD"];
$body = file_get_contents("php://input");

$ch = curl_init($targetUrl);
//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //<-- these lines make an unsafe disable SSL verification in cURL (NOT secure) but for testing
//curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); //<-- these lines make an unsafe disable SSL verification in cURL (NOT secure) but for testing

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
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
  echo json_encode(["error" => true, "errorMessage" => "Proxy cURL error: " . $err]);
  exit;
}
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);

http_response_code($http);
echo $response;