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

// Dil-bazlı kolon seçici: base = title|explanation|mission|objective|category
function get_lang_col($base, $lang) {
    $allowed = ['tr','en','ar'];
    $lang = strtolower(trim($lang ?? ''));
    if (in_array($lang, $allowed, true)) {
        return $lang . "_" . $base; // örn: tr_title, en_mission, ar_category
    }
    return $base; // fallback tekil kolon
}

switch ($method) {

    case 'GET':
        $category = isset($_GET['category']) ? mysqli_real_escape_string($conn, $_GET['category']) : '';
        $id       = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $lang     = isset($_GET['lang']) ? $_GET['lang'] : '';

        $title_col       = get_lang_col('title', $lang);
        $explanation_col = get_lang_col('explanation', $lang);
        $mission_col     = get_lang_col('mission', $lang);
        $objective_col   = get_lang_col('objective', $lang);
        $category_col    = get_lang_col('category', $lang);

        if ($id > 0) {
            $sql = "SELECT id,
                           $title_col       AS title,
                           $explanation_col AS explanation,
                           $mission_col     AS mission,
                           $objective_col   AS objective,
                           $category_col    AS category,
                           image,
                           goal_amount AS goal, raised_amount AS raised,
                           status, created_at
                    FROM projects
                    WHERE id=$id AND isDeleted=0";
        } elseif ($category && $category !== 'All') {
            // Kategori filtresi seçilen dil kolonuna uygulanır
            $sql = "SELECT id,
                           $title_col       AS title,
                           $explanation_col AS explanation,
                           $mission_col     AS mission,
                           $objective_col   AS objective,
                           $category_col    AS category,
                           image,
                           goal_amount AS goal, raised_amount AS raised,
                           status, created_at
                    FROM projects
                    WHERE $category_col='$category' AND isDeleted=0
                    ORDER BY created_at DESC";
        } else {
            $sql = "SELECT id,
                           $title_col       AS title,
                           $explanation_col AS explanation,
                           $mission_col     AS mission,
                           $objective_col   AS objective,
                           $category_col    AS category,
                           image,
                           goal_amount AS goal, raised_amount AS raised,
                           status, created_at
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

        $lang            = $data['lang'] ?? '';
        $title_col       = get_lang_col('title', $lang);
        $explanation_col = get_lang_col('explanation', $lang);
        $mission_col     = get_lang_col('mission', $lang);
        $objective_col   = get_lang_col('objective', $lang);
        $category_col    = get_lang_col('category', $lang);

        $title       = mysqli_real_escape_string($conn, $data['title'] ?? '');
        $explanation = mysqli_real_escape_string($conn, $data['explanation'] ?? '');
        $mission     = mysqli_real_escape_string($conn, $data['mission'] ?? '');
        $objective   = mysqli_real_escape_string($conn, $data['objective'] ?? '');
        $category    = mysqli_real_escape_string($conn, $data['category'] ?? '');
        $image       = mysqli_real_escape_string($conn, $data['image'] ?? '');
        $goal        = floatval($data['goal'] ?? 0);
        $raised      = isset($data['raised']) ? floatval($data['raised']) : 0;
        $status      = mysqli_real_escape_string($conn, $data['status'] ?? '');

        $sql = "INSERT INTO projects ($title_col, $explanation_col, $mission_col, $objective_col, $category_col, image, goal_amount, raised_amount, status)
                VALUES ('$title', '$explanation', '$mission', '$objective', '$category', '$image', $goal, $raised, '$status')";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Project added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id   = intval($params['id'] ?? 0);
        $data = json_decode(file_get_contents("php://input"), true);

        $lang            = $data['lang'] ?? '';
        $title_col       = get_lang_col('title', $lang);
        $explanation_col = get_lang_col('explanation', $lang);
        $mission_col     = get_lang_col('mission', $lang);
        $objective_col   = get_lang_col('objective', $lang);
        $category_col    = get_lang_col('category', $lang);

        $title       = mysqli_real_escape_string($conn, $data['title'] ?? '');
        $explanation = mysqli_real_escape_string($conn, $data['explanation'] ?? '');
        $mission     = mysqli_real_escape_string($conn, $data['mission'] ?? '');
        $objective   = mysqli_real_escape_string($conn, $data['objective'] ?? '');
        $category    = mysqli_real_escape_string($conn, $data['category'] ?? '');
        $image       = mysqli_real_escape_string($conn, $data['image'] ?? '');
        $goal        = floatval($data['goal'] ?? 0);
        $raised      = floatval($data['raised'] ?? 0);
        $status      = mysqli_real_escape_string($conn, $data['status'] ?? '');

        $sql = "UPDATE projects SET
                $title_col='$title',
                $explanation_col='$explanation',
                $mission_col='$mission',
                $objective_col='$objective',
                $category_col='$category',
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
        $id   = intval($params['id']);
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
