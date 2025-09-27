<?php
// --- CORS ve JSON başlıkları ---
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // gerekiyorsa burayı üretimde domaininle sınırla
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight'ı yanıtlama
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(100);
    exit();
}

// Üretimde **ekrana** hata bastırma! (JSON'u bozar)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL); // log için açık kalsın

require 'db.php';

// Güvenli JSON çıktı helper'ı (hata olsa bile tek noktadan JSON döndür)
function json_out($arr, $code = 200)
{
    http_response_code($code);
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    exit();
}

$raw = file_get_contents("php://input");
if ($raw === false) {
    json_out(['success' => false, 'message' => 'Gövde okunamadı.'], 400);
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    json_out(['success' => false, 'message' => 'Geçersiz JSON.'], 400);
}

if (empty($data['email']) || empty($data['password'])) {
    json_out(['success' => false, 'message' => 'E-posta ve şifre alanları zorunludur.'], 400);
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

$stmt = $conn->prepare("SELECT id, first_name, email, password_hash FROM users WHERE email = ?");
if (!$stmt) {
    json_out(['success' => false, 'message' => 'Sorgu hazırlanamıyor.'], 500);
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        json_out(['success' => true, 'message' => 'Giriş başarılı!', 'user' => $user], 200);
    }
}

json_out(['success' => false, 'message' => 'Hatalı e-posta veya şifre.'], 401);
