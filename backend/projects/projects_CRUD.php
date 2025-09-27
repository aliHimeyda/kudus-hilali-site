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
function get_lang_col($base, $lang)
{
    $allowed = ['tr', 'en', 'ar'];
    $lang = strtolower(trim($lang ?? ''));
    if (in_array($lang, $allowed, true)) {
        return $lang . "_" . $base; // örn: tr_title, en_mission, ar_category
    }
    return $base; // fallback tekil kolon
}

switch ($method) {

    case 'GET':
        $category = isset($_GET['category']) ? mysqli_real_escape_string($conn, $_GET['category']) : '';
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $lang = isset($_GET['lang']) ? $_GET['lang'] : '';

        if ($lang) {
            // Eğer dil parametresi gönderilmişse sadece o dilin kolonlarını seç
            $title_col = get_lang_col('title', $lang);
            $explanation_col = get_lang_col('explanation', $lang);
            $mission_col = get_lang_col('mission', $lang);
            $objective_col = get_lang_col('objective', $lang);
            $category_col = get_lang_col('category', $lang);

            $select_cols = "
            $title_col       AS title,
            $explanation_col AS explanation,
            $mission_col     AS mission,
            $objective_col   AS objective,
            $category_col    AS category
        ";
        } else {
            // Eğer dil gönderilmemişse tüm dilleri seç
            $select_cols = "
            en_title, tr_title, ar_title,
            en_explanation, tr_explanation, ar_explanation,
            en_mission, tr_mission, ar_mission,
            en_objective, tr_objective, ar_objective,
            en_category, tr_category, ar_category
        ";
        }

        if ($id > 0) {
            $sql = "SELECT id,
                       $select_cols,
                       image,
                       goal_amount AS goal, raised_amount AS raised,
                       status, created_at
                FROM projects
                WHERE id=$id AND isDeleted=0";
        } elseif ($category && $category !== 'All' && $lang) {
            // kategori filtresi sadece dil seçilmişse uygulanır
            $category_col = get_lang_col('category', $lang);
            $sql = "SELECT id,
                       $select_cols,
                       image,
                       goal_amount AS goal, raised_amount AS raised,
                       status, created_at
                FROM projects
                WHERE $category_col='$category' AND isDeleted=0
                ORDER BY created_at DESC";
        } else {
            $sql = "SELECT id,
                       $select_cols,
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
    header('Content-Type: application/json; charset=utf-8');

    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["status"=>"error","message"=>"Invalid JSON"]); break;
    }

    mysqli_set_charset($conn, 'utf8mb4');

    // Sadece bu kolonları kabul et (şemanla birebir)
    $allowed = [
        // çok dilli alanlar
        'en_title','tr_title','ar_title',
        'en_explanation','tr_explanation','ar_explanation',
        'en_mission','tr_mission','ar_mission',
        'en_objective','tr_objective','ar_objective',
        'en_category','tr_category','ar_category',
        // ortak alanlar
        'image','goal_amount','raised_amount','status',
    ];

    // (Opsiyonel) basit doğrulama
    if (
        empty($data['en_title']) &&
        empty($data['tr_title']) &&
        empty($data['ar_title'])
    ) {
        http_response_code(422);
        echo json_encode(["status"=>"error","message"=>"At least one title (en/tr/ar) is required"]); break;
    }

    // Gönderilenlerden allowed olanları sırayla topla
    $columns = [];
    $placeholders = [];
    $values = [];
    foreach ($allowed as $col) {
        if (array_key_exists($col, $data)) {
            $columns[]      = $col;
            $placeholders[] = '?';
            if ($col === 'goal_amount' || $col === 'raised_amount') {
                $values[] = (string) (float) $data[$col]; // numerik güvenliği; string bind yeterli
            } else {
                $values[] = (string) $data[$col];
            }
        }
    }

    if (empty($columns)) {
        http_response_code(422);
        echo json_encode(["status"=>"error","message"=>"No fields provided"]); break;
    }

    // Prepared INSERT
    $colsSql = '`' . implode('`, `', $columns) . '`';
    $phSql   = implode(', ', $placeholders);
    $sql     = "INSERT INTO `projects` ($colsSql) VALUES ($phSql)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status"=>"error","message"=>"Prepare failed","detail"=>$conn->error]); break;
    }

    $types = str_repeat('s', count($values)); // pratik: hepsini 's' olarak bağla
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        echo json_encode(["status"=>"success","id"=>$stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["status"=>"error","message"=>"DB error","detail"=>$stmt->error]);
    }
    $stmt->close();
    break;



    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id'] ?? 0);
        $data = json_decode(file_get_contents("php://input"), true);

        $lang = $data['lang'] ?? '';
        $title_col = get_lang_col('title', $lang);
        $explanation_col = get_lang_col('explanation', $lang);
        $mission_col = get_lang_col('mission', $lang);
        $objective_col = get_lang_col('objective', $lang);
        $category_col = get_lang_col('category', $lang);

        $title = mysqli_real_escape_string($conn, $data['title'] ?? '');
        $explanation = mysqli_real_escape_string($conn, $data['explanation'] ?? '');
        $mission = mysqli_real_escape_string($conn, $data['mission'] ?? '');
        $objective = mysqli_real_escape_string($conn, $data['objective'] ?? '');
        $category = mysqli_real_escape_string($conn, $data['category'] ?? '');
        $image = mysqli_real_escape_string($conn, $data['image'] ?? '');
        $goal = floatval($data['goal'] ?? 0);
        $raised = floatval($data['raised'] ?? 0);
        $status = mysqli_real_escape_string($conn, $data['status'] ?? '');

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