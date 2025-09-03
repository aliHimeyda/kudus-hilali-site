<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'db.php';
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->firstName) || !isset($data->email) || !isset($data->password) || empty($data->firstName) || empty($data->email) || empty($data->password)) {
    echo json_encode(['success' => false, 'message' => 'Lütfen tüm alanları doldurun.']);
    exit();
}
$firstName = $conn->real_escape_string($data->firstName);
$email = $conn->real_escape_string($data->email);
$password = $data->password;
$checkEmail = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Bu e-posta adresi zaten kullanılıyor.']);
    $checkEmail->close();
    $conn->close();
    exit();
}
$checkEmail->close();
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $conn->prepare("INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $firstName, $email, $password_hash);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Kayıt sırasında bir hata oluştu: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>