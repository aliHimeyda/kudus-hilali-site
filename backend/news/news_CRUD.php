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
        $category = isset($_GET['category']) ? mysqli_real_escape_string($conn, $_GET['category']) : '';
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id > 0) {
            $sql = "SELECT id, title, content, category, admin_name, admin_image, image_url AS image, publish_date, created_at 
                    FROM news 
                    WHERE id=$id AND isDeleted=0";
        } elseif ($category && $category !== 'All') {
            $sql = "SELECT id, title, content, category, admin_name, admin_image, image_url AS image, publish_date, created_at 
                    FROM news 
                    WHERE category='$category' AND isDeleted=0
                    ORDER BY created_at DESC";
        } else {
            $sql = "SELECT id, title, content, category, admin_name, admin_image, image_url AS image, publish_date, created_at 
                    FROM news 
                    WHERE isDeleted=0
                    ORDER BY created_at DESC";
        }

        $result = $conn->query($sql);
        $newsData = [];

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $newsData[] = $row;
            }
        }

        echo json_encode(["status" => "success", "data" => $newsData], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $title = mysqli_real_escape_string($conn, $data['title']);
        $content = mysqli_real_escape_string($conn, $data['content']);
        $category = mysqli_real_escape_string($conn, $data['category']);
        $admin_name = mysqli_real_escape_string($conn, $data['admin_name']);
        $admin_image = mysqli_real_escape_string($conn, $data['admin_image']);
        $image_url = mysqli_real_escape_string($conn, $data['image_url']);
        $publish_date = mysqli_real_escape_string($conn, $data['publish_date']);

        $sql = "INSERT INTO news (title, content, category, admin_name, admin_image, image_url, publish_date)
                VALUES ('$title', '$content', '$category', '$admin_name', '$admin_image', '$image_url', '$publish_date')";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "News added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $data = json_decode(file_get_contents("php://input"), true);

        $title = mysqli_real_escape_string($conn, $data['title']);
        $content = mysqli_real_escape_string($conn, $data['content']);
        $category = mysqli_real_escape_string($conn, $data['category']);
        $admin_name = mysqli_real_escape_string($conn, $data['admin_name']);
        $admin_image = mysqli_real_escape_string($conn, $data['admin_image']);
        $image_url = mysqli_real_escape_string($conn, $data['image_url']);
        $publish_date = mysqli_real_escape_string($conn, $data['publish_date']);

        $sql = "UPDATE news SET
                title='$title',
                content='$content',
                category='$category',
                admin_name='$admin_name',
                admin_image='$admin_image',
                image_url='$image_url',
                publish_date='$publish_date'
                WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "News updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $soft = isset($params['soft']) ? intval($params['soft']) : 1;

        if ($soft === 1) {
            $sql = "UPDATE news SET isDeleted=1 WHERE id=$id";
            $msg = "News soft-deleted";
        } else {
            $sql = "DELETE FROM news WHERE id=$id";
            $msg = "News permanently deleted";
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
