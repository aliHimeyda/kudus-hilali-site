<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$host = "localhost";
$username = "root";
$password = "12345";
$dbname = "kudus";
$port = 8889;

$conn = new mysqli($host, $username, $password, $dbname, $port);


if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connecting error: " . $conn->connect_error
    ]);
    exit;
}
?>
