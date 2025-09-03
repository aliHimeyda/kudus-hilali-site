<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password) || empty($data->email) || empty($data->password)) {
    echo json_encode(['success' => false, 'message' => 'E-posta ve şifre alanları zorunludur.']);
    exit();
}

$email = $conn->real_escape_string($data->email);
$password = $data->password;

$stmt = $conn->prepare("SELECT id, first_name, email, password_hash FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        echo json_encode(['success' => true, 'message' => 'Giriş başarılı!', 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Hatalı e-posta veya şifre.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Hatalı e-posta veya şifre.']);
}

$stmt->close();
$conn->close();
?>