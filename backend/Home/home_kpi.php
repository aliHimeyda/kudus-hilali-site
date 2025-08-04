<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../db.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($method) {

    case 'GET':
        $sql = "SELECT id, months, projects, partners, budget, hero_image 
                FROM home_stats 
                WHERE isDeleted=0 
                ORDER BY created_at DESC 
                LIMIT 1";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(["status" => "success", "data" => $row], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["status" => "success", "data" => []]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $data = json_decode(file_get_contents("php://input"), true);

        $months = intval($data['months']);
        $projects = intval($data['projects']);
        $partners = intval($data['partners']);
        $budget = mysqli_real_escape_string($conn, $data['budget']);
        $hero_image = mysqli_real_escape_string($conn, $data['hero_image']);

        $sql = "UPDATE home_stats 
                SET months=$months, projects=$projects, partners=$partners, budget='$budget', hero_image='$hero_image'
                WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "KPI updated successfully"]);
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
