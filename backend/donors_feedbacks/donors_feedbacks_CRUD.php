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

// güvenlik için izinli diller
function get_feedback_column($lang)
{
    $allowed = ['tr', 'en', 'ar'];
    $lang = strtolower(trim($lang ?? ''));
    return in_array($lang, $allowed, true) ? $lang . "_feedback" : "feedback";
}

switch ($method) {

    case 'GET':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $lang = $_GET['lang'] ?? '';

        if ($lang) {
            // Tek dil seçiliyse sadece o dil
            $feedback_col = get_feedback_column($lang); // en_feedback | tr_feedback | ar_feedback
            $feedback_select = "$feedback_col AS feedback";
        } else {
            // Dil parametresi yoksa tüm diller
            $feedback_select = "
            en_feedback,
            tr_feedback,
            ar_feedback
        ";
        }

        if ($id > 0) {
            $sql = "SELECT
                    id,
                    donor_name,
                    $feedback_select,
                    stars,
                    image_url,
                    isDeleted,
                    created_at
                FROM donors_feedbacks
                WHERE id=$id AND isDeleted=0";
        } else {
            $sql = "SELECT
                    id,
                    donor_name,
                    $feedback_select,
                    stars,
                    image_url,
                    isDeleted,
                    created_at
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

        echo json_encode(['status' => 'success', 'data' => $feedbacks], JSON_UNESCAPED_UNICODE);
        break;


    case 'POST':
        header('Content-Type: application/json; charset=utf-8');

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
            break;
        }

        // (Önerilir) UTF-8
        mysqli_set_charset($conn, 'utf8mb4');

        // 1) Whitelist: sadece bu kolonları kabul et
        $allowed = [
            'donor_name',
            'en_feedback',
            'tr_feedback',
            'ar_feedback',
            'stars',
            'image_url',
        ];

        // (Opsiyonel) Basit zorunlu alan kontrolü
        if (empty($data['donor_name'])) {
            http_response_code(422);
            echo json_encode(["status" => "error", "message" => "Missing donor_name"]);
            break;
        }
        if (
            empty($data['en_feedback']) &&
            empty($data['tr_feedback']) &&
            empty($data['ar_feedback'])
        ) {
            http_response_code(422);
            echo json_encode(["status" => "error", "message" => "At least one feedback (en/tr/ar) is required"]);
            break;
        }

        // 2) Gönderilenlerden allowed olanları sırayla topla
        $columns = [];
        $placeholders = [];
        $values = [];

        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $columns[] = $col;
                $placeholders[] = '?';
                if ($col === 'stars') {
                    $values[] = (string) (int) $data[$col]; // numerik bind, 's' ile de gönderiyoruz
                } else {
                    $values[] = (string) $data[$col];
                }
            }
        }

        if (empty($columns)) {
            http_response_code(422);
            echo json_encode(["status" => "error", "message" => "No fields provided"]);
            break;
        }

        // 3) DÜMDÜZ INSERT (prepared + backtick)
        $colsSql = '`' . implode('`, `', $columns) . '`';
        $phSql = implode(', ', $placeholders);
        $sql = "INSERT INTO `donors_feedbacks` ($colsSql) VALUES ($phSql)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Prepare failed", "detail" => $conn->error]);
            break;
        }

        // Hepsini 's' ile bağlamak pratik ve güvenli (int de string olarak geçebilir)
        $types = str_repeat('s', count($values));
        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "DB error", "detail" => $stmt->error]);
        }
        $stmt->close();
        break;


    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = intval($params['id']);
        $data = json_decode(file_get_contents("php://input"), true);
        $lang = $data['lang'] ?? '';
        $feedback_col = get_feedback_column($lang);

        $donor_name = mysqli_real_escape_string($conn, $data['donor_name']);
        $feedback = mysqli_real_escape_string($conn, $data['feedback']);
        $stars = intval($data['stars']);
        $image_url = mysqli_real_escape_string($conn, $data['image_url']);

        $sql = "UPDATE donors_feedbacks SET
                donor_name='$donor_name',
                $feedback_col='$feedback',
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