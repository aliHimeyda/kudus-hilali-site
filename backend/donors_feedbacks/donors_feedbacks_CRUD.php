<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../db.php");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($method) {

    case 'GET':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id > 0) {
            $sql = "SELECT id, donor_name, feedback, stars, image_url, isDeleted, created_at 
                    FROM donors_feedbacks 
                    WHERE id=$id AND isDeleted=0";
        } else {
            $sql = "SELECT id, donor_name, feedback, stars, image_url, isDeleted, created_at 
                    FROM donors_feedbacks 
                    WHERE isDeleted=0 
                    ORDER BY created_at DESC";
        }

        $result = $conn->query($sql);
        $feedbacks = [];

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $feedbacks[] = $row;
            }
        }
        echo json_encode(["status" => "success", "data" => $feedbacks], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $donor_name = mysqli_real_escape_string($conn, $data['donor_name']);
        $feedback = mysqli_real_escape_string($conn, $data['feedback']);
        $stars = intval($data['stars']);
        $image_url = mysqli_real_escape_string($conn, $data['image_url']);

        $sql = "INSERT INTO donors_feedbacks (donor_name, feedback, stars, image_url) 
                VALUES ('$donor_name', '$feedback', $stars, '$image_url')";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Donor feedback added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $data = json_decode(file_get_contents("php://input"), true);

        $donor_name = mysqli_real_escape_string($conn, $data['donor_name']);
        $feedback = mysqli_real_escape_string($conn, $data['feedback']);
        $stars = intval($data['stars']);
        $image_url = mysqli_real_escape_string($conn, $data['image_url']);

        $sql = "UPDATE donors_feedbacks SET
                donor_name='$donor_name',
                feedback='$feedback',
                stars=$stars,
                image_url='$image_url'
                WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Donor feedback updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $soft = isset($params['soft']) ? intval($params['soft']) : 1;

        if ($soft === 1) {
            $sql = "UPDATE donors_feedbacks SET isDeleted=1 WHERE id=$id";
            $msg = "Donor feedback soft-deleted";
        } else {
            $sql = "DELETE FROM donors_feedbacks WHERE id=$id";
            $msg = "Donor feedback permanently deleted";
        }

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => $msg]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

$conn->close();
?>