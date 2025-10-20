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

// Yalnız role, address, bio, experience için dil bazlı kolon seçici
function get_lang_col($base, $lang)
{
    // $base: role | address | bio | experience
    $allowed = ['tr', 'en', 'ar'];
    $lang = strtolower(trim($lang ?? ''));
    if (in_array($lang, $allowed, true)) {
        return $lang . "_" . $base; // örn: tr_role, en_bio
    }
    return $base; // fallback: base kolon
}

// name için özel kural:
// - ar -> ar_name
// - tr/en/diğer -> en_name
function get_name_col($lang)
{
    $lang = strtolower(trim($lang ?? ''));
    if (strlen($lang) > 2) {
        $lang = substr($lang, 0, 2);
    }
    return ($lang === 'ar') ? 'ar_name' : 'en_name';
}

switch ($method) {

    case 'GET':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $lang = $_GET['lang'] ?? '';

        if ($lang) {
            // Tek dil seçili: ilgili kolonları alias ile döndür
            $name_col = get_name_col($lang);           // en_name / ar_name (tr yoksa fallback)
            $role_col = get_lang_col('role', $lang);   // en_role, tr_role, ar_role
            $address_col = get_lang_col('address', $lang);
            $bio_col = get_lang_col('bio', $lang);
            $exp_col = get_lang_col('experience', $lang);

            $select_cols = "
            $name_col   AS name,
            $role_col   AS role,
            image_url   AS image,
            $address_col AS address,
            phone,
            email,
            $bio_col    AS bio,
            $exp_col    AS experience,
            facebook,
            linkedin,
            twitter,
            instagram,
            created_at
        ";
        } else {
            // Dil belirtilmemiş: tüm diller
            $select_cols = "
            en_name, ar_name,                -- tr_name yok
            en_role, tr_role, ar_role,
            image_url AS image,
            en_address, tr_address, ar_address,
            phone,
            email,
            en_bio, tr_bio, ar_bio,
            en_experience, tr_experience, ar_experience,
            facebook,
            linkedin,
            twitter,
            instagram,
            created_at
        ";
        }

        if ($id > 0) {
            $sql = "SELECT id, $select_cols
                FROM teams
                WHERE id=$id AND isDeleted=0";
        } else {
            $sql = "SELECT id, $select_cols
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

        echo json_encode(['status' => 'success', 'data' => $teams], JSON_UNESCAPED_UNICODE);
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

        // DB bağlantısından hemen sonra önerilir:
        mysqli_set_charset($conn, 'utf8mb4');

        // 1) Yalnızca BU kolonlara yaz (whitelist)
        $allowed = [
            // çok dilli alanlar
            'en_name',
            'ar_name',
            'en_role',
            'tr_role',
            'ar_role',
            'en_address',
            'tr_address',
            'ar_address',
            'en_bio',
            'tr_bio',
            'ar_bio',
            'en_experience',
            'tr_experience',
            'ar_experience',
            // ortak alanlar
            'image_url',
            'phone',
            'email',
            'facebook',
            'linkedin',
            'twitter',
            'instagram',
            // opsiyonel soft-delete bayrağı
            'isDeleted'
        ];

        // 2) Gönderilenlerden var olanları topla (sırası allowed’a göre)
        $columns = [];
        $placeholders = [];
        $values = [];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $columns[] = $col;
                $placeholders[] = '?';
                $values[] = (string) $data[$col]; // boş ise '' gider; NULL istiyorsan (string) yerine null bırak
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
        $sql = "INSERT INTO `teams` ($colsSql) VALUES ($phSql)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Prepare failed", "detail" => $conn->error]);
            break;
        }

        $types = str_repeat('s', count($values)); // hepsini string bağlıyoruz (pratik ve güvenli)
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
        $id = intval($params['id'] ?? 0);
        $data = json_decode(file_get_contents("php://input"), true) ?? [];

        // lang: önce body, yoksa query
        $lang = $data['lang'] ?? ($params['lang'] ?? '');

        $name_col = get_name_col($lang);
        $role_col = get_lang_col('role', $lang);
        $address_col = get_lang_col('address', $lang);
        $bio_col = get_lang_col('bio', $lang);
        $experience_col = get_lang_col('experience', $lang);

        // Kolon adları boşsa erken çık (aksi SQL syntax error 1064)
        if (!$name_col || !$role_col || !$address_col || !$bio_col || !$experience_col) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid lang or column mapping"]);
            break;
        }

        $name = mysqli_real_escape_string($conn, $data['name'] ?? '');
        $role = mysqli_real_escape_string($conn, $data['role'] ?? '');
        $image_url = mysqli_real_escape_string($conn, $data['image_url'] ?? $data['image'] ?? '');
        $address = mysqli_real_escape_string($conn, $data['address'] ?? '');
        $phone = mysqli_real_escape_string($conn, $data['phone'] ?? '');
        $email = mysqli_real_escape_string($conn, $data['email'] ?? '');
        $bio = mysqli_real_escape_string($conn, $data['bio'] ?? '');
        $experience = mysqli_real_escape_string($conn, $data['experience'] ?? '');
        $facebook = mysqli_real_escape_string($conn, $data['facebook'] ?? '');
        $linkedin = mysqli_real_escape_string($conn, $data['linkedin'] ?? '');
        $twitter = mysqli_real_escape_string($conn, $data['twitter'] ?? '');
        $instagram = mysqli_real_escape_string($conn, $data['instagram'] ?? '');

        // >>> BACKTICK YOK, normal string <<<
        $sql = "
        UPDATE teams SET
            $name_col = '$name',
            $role_col = '$role',
            image_url = '$image_url',
            $address_col = '$address',
            phone = '$phone',
            email = '$email',
            $bio_col = '$bio',
            $experience_col = '$experience',
            facebook = '$facebook',
            linkedin = '$linkedin',
            twitter = '$twitter',
            instagram = '$instagram'
        WHERE id = $id
    ";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Team member updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $conn->error, "sql" => $sql]);
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