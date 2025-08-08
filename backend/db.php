<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$host = "srv494.hstgr.io";
$username = "u852957645_kudushilali";
$password = "Kudushilali12345";
$dbname = "u852957645_kududb";
$port = 8889;

$conn = new mysqli($host, $username, $password, $dbname);



if ($conn->connect_error) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connecting error: " . $conn->connect_error
    ]);
    exit;
}
?>