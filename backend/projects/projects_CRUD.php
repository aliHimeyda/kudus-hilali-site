<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "../db.php";

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
            $sql = "SELECT id, title, explanation, mission, objective, category, image, 
                           goal_amount AS goal, raised_amount AS raised, status, created_at
                    FROM projects
                    WHERE id=$id AND isDeleted=0";
        } elseif ($category && $category !== 'All') {
            $sql = "SELECT id, title, explanation, mission, objective, category, image, 
                           goal_amount AS goal, raised_amount AS raised, status, created_at
                    FROM projects
                    WHERE category='$category' AND isDeleted=0
                    ORDER BY created_at DESC";
        } else {
            $sql = "SELECT id, title, explanation, mission, objective, category, image, 
                           goal_amount AS goal, raised_amount AS raised, status, created_at
                    FROM projects
                    WHERE isDeleted=0
                    ORDER BY created_at DESC";
        }

        $result = $conn->query($sql);
        $projects = [];

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $projects[] = $row;
            }
        }
        echo json_encode(["status" => "success", "data" => $projects], JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $title = mysqli_real_escape_string($conn, $data['title']);
        $explanation = mysqli_real_escape_string($conn, $data['explanation']);
        $mission = mysqli_real_escape_string($conn, $data['mission']);
        $objective = mysqli_real_escape_string($conn, $data['objective']);
        $category = mysqli_real_escape_string($conn, $data['category']);
        $image = mysqli_real_escape_string($conn, $data['image']);
        $goal = floatval($data['goal']);
        $raised = isset($data['raised']) ? floatval($data['raised']) : 0;
        $status = mysqli_real_escape_string($conn, $data['status']);

        $sql = "INSERT INTO projects (title, explanation, mission, objective, category, image, goal_amount, raised_amount, status)
                VALUES ('$title', '$explanation', '$mission', '$objective', '$category', '$image', $goal, $raised, '$status')";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Project added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $data = json_decode(file_get_contents("php://input"), true);

        $title = mysqli_real_escape_string($conn, $data['title']);
        $explanation = mysqli_real_escape_string($conn, $data['explanation']);
        $mission = mysqli_real_escape_string($conn, $data['mission']);
        $objective = mysqli_real_escape_string($conn, $data['objective']);
        $category = mysqli_real_escape_string($conn, $data['category']);
        $image = mysqli_real_escape_string($conn, $data['image']);
        $goal = floatval($data['goal']);
        $raised = floatval($data['raised']);
        $status = mysqli_real_escape_string($conn, $data['status']);

        $sql = "UPDATE projects SET
                title='$title',
                explanation='$explanation',
                mission='$mission',
                objective='$objective',
                category='$category',
                image='$image',
                goal_amount=$goal,
                raised_amount=$raised,
                status='$status'
                WHERE id=$id";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Project updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $soft = isset($params['soft']) ? intval($params['soft']) : 1;

        if ($soft === 1) {
            $sql = "UPDATE projects SET isDeleted=1 WHERE id=$id";
            $msg = "Project soft-deleted";
        } else {
            $sql = "DELETE FROM projects WHERE id=$id";
            $msg = "Project permanently deleted";
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
