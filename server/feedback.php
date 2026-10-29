<?php
// Chess School feedback receiver. Put this file on your own web host (any PHP 7+ host), then set "endpoint" in
// feedback-config.json (inside the app's folder) to this file's URL. It accepts the JSON file the app exports (Settings, Reviews),
// checks that it is the right shape and small, and stores each submission as its own file in a folder that web users cannot read.
// It sends nothing anywhere. Reviewer names are personal data: keep the folder private and delete files when you no longer need them.
// Not tested on a live host by the author of this project; read it and try it with a test submission first.

const MAX_BYTES = 300000;                        // reject anything bigger
const STORE_DIR = __DIR__ . '/feedback-inbox';   // must not be served to the public (an .htaccess is written into it; check your host honours it)
const ALLOW_ORIGIN = '*';                        // set to your site's origin, e.g. 'https://example.com', if the app is on another domain

header('Access-Control-Allow-Origin: ' . ALLOW_ORIGIN);
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('POST only'); }

$raw = file_get_contents('php://input', false, null, 0, MAX_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BYTES) { http_response_code(413); exit('Too large'); }
$d = json_decode($raw, true);
if (!is_array($d) || ($d['format'] ?? '') !== 'chess-school-review' || !isset($d['items']) || !is_array($d['items'])) { http_response_code(400); exit('Not a review file'); }
if (count($d['items']) > 500) { http_response_code(413); exit('Too many items'); }

if (!is_dir(STORE_DIR)) { mkdir(STORE_DIR, 0750, true); file_put_contents(STORE_DIR . '/.htaccess', "Require all denied\nDeny from all\n"); }
$name = date('Ymd-His') . '-' . bin2hex(random_bytes(6)) . '.json';
file_put_contents(STORE_DIR . '/' . $name, json_encode($d, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
http_response_code(200);
echo 'ok';
