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
            $sql = "SELECT 
                        id,
                        name,
                        role,
                        image_url AS image,
                        address,
                        phone,
                        email,
                        bio,
                        experience,
                        facebook,
                        linkedin,
                        twitter,
                        instagram,
                        created_at
                    FROM teams
                    WHERE id=$id AND isDeleted=0";
        } else {
            $sql = "SELECT 
                        id,
                        name,
                        role,
                        image_url AS image,
                        address,
                        phone,
                        email,
                        bio,
                        experience,
                        facebook,
                        linkedin,
                        twitter,
                        instagram,
                        created_at
                    FROM teams
                    WHERE isDeleted=0
                    ORDER BY created_at DESC";
        }

        $result = $conn->query($sql);
        $teams = [];

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $teams[] = $row;
            }
        }
        echo json_encode(["status" => "success", "data" => $teams], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $name = mysqli_real_escape_string($conn, $data['name']);
        $role = mysqli_real_escape_string($conn, $data['role']);
        $image_url = mysqli_real_escape_string($conn, $data['image']);
        $address = mysqli_real_escape_string($conn, $data['address']);
        $phone = mysqli_real_escape_string($conn, $data['phone']);
        $email = mysqli_real_escape_string($conn, $data['email']);
        $bio = mysqli_real_escape_string($conn, $data['bio']);
        $experience = mysqli_real_escape_string($conn, $data['experience']);
        $facebook = mysqli_real_escape_string($conn, $data['facebook']);
        $linkedin = mysqli_real_escape_string($conn, $data['linkedin']);
        $twitter = mysqli_real_escape_string($conn, $data['twitter']);
        $instagram = mysqli_real_escape_string($conn, $data['instagram']);

        $sql = "INSERT INTO teams (name, role, image_url, address, phone, email, bio, experience, facebook, linkedin, twitter, instagram)
                VALUES ('$name', '$role', '$image_url', '$address', '$phone', '$email', '$bio', '$experience', '$facebook', '$linkedin', '$twitter', '$instagram')";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Team member added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $data = json_decode(file_get_contents("php://input"), true);

        $name = mysqli_real_escape_string($conn, $data['name']);
        $role = mysqli_real_escape_string($conn, $data['role']);
        $image_url = mysqli_real_escape_string($conn, $data['image']);
        $address = mysqli_real_escape_string($conn, $data['address']);
        $phone = mysqli_real_escape_string($conn, $data['phone']);
        $email = mysqli_real_escape_string($conn, $data['email']);
        $bio = mysqli_real_escape_string($conn, $data['bio']);
        $experience = mysqli_real_escape_string($conn, $data['experience']);
        $facebook = mysqli_real_escape_string($conn, $data['facebook']);
        $linkedin = mysqli_real_escape_string($conn, $data['linkedin']);
        $twitter = mysqli_real_escape_string($conn, $data['twitter']);
        $instagram = mysqli_real_escape_string($conn, $data['instagram']);

        $sql = "UPDATE teams SET 
                    name='$name',
                    role='$role',
                    image_url='$image_url',
                    address='$address',
                    phone='$phone',
                    email='$email',
                    bio='$bio',
                    experience='$experience',
                    facebook='$facebook',
                    linkedin='$linkedin',
                    twitter='$twitter',
                    instagram='$instagram'
                WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Team member updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $soft = isset($params['soft']) ? intval($params['soft']) : 1;

        if ($soft === 1) {
            $sql = "UPDATE teams SET isDeleted=1 WHERE id=$id";
            $msg = "Team member soft-deleted";
        } else {
            $sql = "DELETE FROM teams WHERE id=$id";
            $msg = "Team member permanently deleted";
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
