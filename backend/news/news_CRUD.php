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
function norm_lang($lang)
{
    $lang = strtolower(trim((string) $lang));
    if (strlen($lang) > 2)
        $lang = substr($lang, 0, 2);
    return $lang;
}

function get_lang_col($base, $lang)
{
    $lang = norm_lang($lang);
    $allowed = ['tr', 'en', 'ar'];
    if (!in_array($lang, $allowed, true))
        return null; // <---
    return "{$lang}_{$base}";
}

function get_admin_name_col($lang)
{
    $lang = norm_lang($lang);
    // Şemada tr_admin_name YOK; tr ve en → en_admin_name, ar → ar_admin_name
    return ($lang === 'ar') ? 'ar_admin_name' : 'en_admin_name';
}


switch ($method) {
    case 'GET':
        $categoryParam = isset($_GET['category']) ? mysqli_real_escape_string($conn, $_GET['category']) : '';
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $lang = $_GET['lang'] ?? '';
        $limit = isset($_GET['limit']) ? max(0, intval($_GET['limit'])) : 0;
        $page = isset($_GET['page']) ? max(0, intval($_GET['page'])) : 0;
        $offset = ($limit > 0) ? $page * $limit : 0;
        if ($lang) {
            // Tek dil seçiliyse: o dilin kolonlarını alias'larla döndür
            $title_col = get_lang_col('title', $lang);
            $content_col = get_lang_col('content', $lang);
            $category_col = get_lang_col('category', $lang);
            $admin_name_col = get_admin_name_col($lang); // en_admin_name veya ar_admin_name döndürdüğünü varsayıyoruz

            $select_cols = "
            $title_col       AS title,
            $content_col     AS content,
            $category_col    AS category,
            $admin_name_col  AS admin_name,
            admin_image,
            image_url        AS image,
            publish_date,
            created_at
        ";
        } else {
            // Dil gönderilmemişse: tüm diller
            $select_cols = "
            en_title, tr_title, ar_title,
            en_content, tr_content, ar_content,
            en_category, tr_category, ar_category,
            en_admin_name, ar_admin_name,  -- tr_admin_name yok
            admin_image,
            image_url AS image,
            publish_date,
            created_at
        ";
        }

        if ($id > 0) {
            $sql = "SELECT id, $select_cols
                FROM news
                WHERE id=$id AND isDeleted=0";
        } elseif ($categoryParam && $categoryParam !== 'All') {
            if ($lang) {
                // Tek dil seçiliyken kategori filtresi o dil kolonu üzerinden
                $category_col = get_lang_col('category', $lang);
                $sql = "SELECT id, $select_cols
                    FROM news
                    WHERE $category_col='$categoryParam'
                      AND isDeleted=0
                    ORDER BY created_at DESC";
            } else {
                // Dil yokken kategori filtresi tüm dillerde aranır
                $cat = $categoryParam; // zaten escape edildi
                $sql = "SELECT id, $select_cols
                    FROM news
                    WHERE (
                          en_category='$cat'
                       OR tr_category='$cat'
                       OR ar_category='$cat'
                    )
                      AND isDeleted=0
                    ORDER BY created_at DESC";
            }
        } else {
            $sql = "SELECT id, $select_cols
                FROM news
                WHERE isDeleted=0
                ORDER BY created_at DESC";
        }

        // <-- YENİ: Sadece limit > 0 ise LIMIT ekle
        if ($limit > 0) {
            $sql .= " LIMIT $offset, $limit";
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
        header('Content-Type: application/json; charset=utf-8');

        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
            break;
        }

        mysqli_set_charset($conn, 'utf8mb4');

        // 1) Sadece bu kolonları kabul et (şemanla birebir)
        $allowed = [
            // dil alanları
            'en_title',
            'tr_title',
            'ar_title',
            'en_content',
            'tr_content',
            'ar_content',
            'en_category',
            'tr_category',
            'ar_category',
            'en_admin_name',
            'ar_admin_name', // tr_admin_name yok
            // ortak alanlar
            'admin_image',
            'image_url',
            'publish_date',
            'isDeleted',
        ];

        // (İsteğe bağlı) minimum validasyon: en az bir title dolu olsun
        if (
            empty($data['en_title']) &&
            empty($data['tr_title']) &&
            empty($data['ar_title'])
        ) {
            http_response_code(422);
            echo json_encode(["status" => "error", "message" => "At least one title (en/tr/ar) is required"]);
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
                $values[] = (string) $data[$col];
            }
        }

        if (empty($columns)) {
            http_response_code(422);
            echo json_encode(["status" => "error", "message" => "No fields provided"]);
            break;
        }

        // 3) INSERT (prepared)
        $colsSql = '`' . implode('`, `', $columns) . '`';
        $phSql = implode(', ', $placeholders);
        $sql = "INSERT INTO `news` ($colsSql) VALUES ($phSql)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Prepare failed", "detail" => $conn->error]);
            break;
        }

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
        $id = intval($params['id'] ?? 0);
        $data = json_decode(file_get_contents('php://input'), true);
        if ($id <= 0 || !is_array($data)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid id or payload"]);
            break;
        }

        // Ortak alanlar
        $sets = [];
        $vals = [];
        $types = '';

        foreach (['admin_image', 'image_url', 'publish_date'] as $fixed) {
            if (array_key_exists($fixed, $data)) {
                $sets[] = "`$fixed`=?";
                $vals[] = (string) $data[$fixed];
                $types .= 's';
            }
        }

        $updated = false;

        if (!empty($data['languages']) && is_array($data['languages'])) {
            $seen = [];
            foreach ($data['languages'] as $entry) {
                $lang = norm_lang($entry['lang'] ?? '');
                if (!$lang || isset($seen[$lang]))
                    continue;
                $seen[$lang] = true;

                $map = [
                    get_lang_col('title', $lang) => $entry['title'] ?? null,
                    get_lang_col('content', $lang) => $entry['content'] ?? null,
                    get_lang_col('category', $lang) => $entry['category'] ?? null,
                    get_admin_name_col($lang) => $entry['admin_name'] ?? null,
                ];
                foreach ($map as $col => $val) {
                    if (!$col || $val === null)
                        continue;
                    $sets[] = "`$col`=?";
                    $vals[] = (string) $val;
                    $types .= 's';
                    $updated = true;
                }
            }
        } else {
            $lang = norm_lang($data['lang'] ?? ($params['lang'] ?? ''));
            if (!$lang) {
                http_response_code(422);
                echo json_encode(["status" => "error", "message" => "Missing lang"]);
                break;
            }

            $map = [
                get_lang_col('title', $lang) => $data['title'] ?? null,
                get_lang_col('content', $lang) => $data['content'] ?? null,
                get_lang_col('category', $lang) => $data['category'] ?? null,
                get_admin_name_col($lang) => $data['admin_name'] ?? null,
            ];
            foreach ($map as $col => $val) {
                if (!$col || $val === null)
                    continue;
                $sets[] = "`$col`=?";
                $vals[] = (string) $val;
                $types .= 's';
                $updated = true;
            }
        }

        if (!$updated && empty($sets)) {
            http_response_code(422);
            echo json_encode(["status" => "error", "message" => "No fields to update"]);
            break;
        }

        $sql = "UPDATE `news` SET " . implode(', ', $sets) . " WHERE id=?";
        $types .= 'i';
        $vals[] = $id;

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Prepare failed", "detail" => $conn->error]);
            break;
        }
        $stmt->bind_param($types, ...$vals);

        if ($stmt->execute()) {
            echo "<script>console.log($sql);</script>";
            echo json_encode(["status" => "success", "message" => "News updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "DB error", "detail" => $stmt->error]);
        }
        $stmt->close();
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