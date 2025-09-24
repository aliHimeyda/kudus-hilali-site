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
function get_lang_col($base, $lang) {
    // $base: role | address | bio | experience
    $allowed = ['tr','en','ar'];
    $lang = strtolower(trim($lang ?? ''));
    if (in_array($lang, $allowed, true)) {
        return $lang . "_" . $base; // örn: tr_role, en_bio
    }
    return $base; // fallback: base kolon
}

switch ($method) {

    case 'GET':
        $id   = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $lang = isset($_GET['lang']) ? $_GET['lang'] : '';

        $role_col        = get_lang_col('role', $lang);
        $address_col     = get_lang_col('address', $lang);
        $bio_col         = get_lang_col('bio', $lang);
        $experience_col  = get_lang_col('experience', $lang);

        if ($id > 0) {
            $sql = "SELECT 
                        id,
                        name,
                        $role_col       AS role,
                        image_url       AS image,
                        $address_col    AS address,
                        phone,
                        email,
                        $bio_col        AS bio,
                        $experience_col AS experience,
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
                        $role_col       AS role,
                        image_url       AS image,
                        $address_col    AS address,
                        phone,
                        email,
                        $bio_col        AS bio,
                        $experience_col AS experience,
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

        $lang            = $data['lang'] ?? '';
        $role_col        = get_lang_col('role', $lang);
        $address_col     = get_lang_col('address', $lang);
        $bio_col         = get_lang_col('bio', $lang);
        $experience_col  = get_lang_col('experience', $lang);

        $name        = mysqli_real_escape_string($conn, $data['name'] ?? '');
        $role        = mysqli_real_escape_string($conn, $data['role'] ?? '');
        $image_url   = mysqli_real_escape_string($conn, $data['image'] ?? '');
        $address     = mysqli_real_escape_string($conn, $data['address'] ?? '');
        $phone       = mysqli_real_escape_string($conn, $data['phone'] ?? '');
        $email       = mysqli_real_escape_string($conn, $data['email'] ?? '');
        $bio         = mysqli_real_escape_string($conn, $data['bio'] ?? '');
        $experience  = mysqli_real_escape_string($conn, $data['experience'] ?? '');
        $facebook    = mysqli_real_escape_string($conn, $data['facebook'] ?? '');
        $linkedin    = mysqli_real_escape_string($conn, $data['linkedin'] ?? '');
        $twitter     = mysqli_real_escape_string($conn, $data['twitter'] ?? '');
        $instagram   = mysqli_real_escape_string($conn, $data['instagram'] ?? '');

        $sql = "INSERT INTO teams (name, $role_col, image_url, $address_col, phone, email, $bio_col, $experience_col, facebook, linkedin, twitter, instagram)
                VALUES ('$name', '$role', '$image_url', '$address', '$phone', '$email', '$bio', '$experience', '$facebook', '$linkedin', '$twitter', '$instagram')";

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Team member added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id   = intval($params['id'] ?? 0);
        $data = json_decode(file_get_contents("php://input"), true);

        $lang            = $data['lang'] ?? '';
        $role_col        = get_lang_col('role', $lang);
        $address_col     = get_lang_col('address', $lang);
        $bio_col         = get_lang_col('bio', $lang);
        $experience_col  = get_lang_col('experience', $lang);

        $name        = mysqli_real_escape_string($conn, $data['name'] ?? '');
        $role        = mysqli_real_escape_string($conn, $data['role'] ?? '');
        $image_url   = mysqli_real_escape_string($conn, $data['image'] ?? '');
        $address     = mysqli_real_escape_string($conn, $data['address'] ?? '');
        $phone       = mysqli_real_escape_string($conn, $data['phone'] ?? '');
        $email       = mysqli_real_escape_string($conn, $data['email'] ?? '');
        $bio         = mysqli_real_escape_string($conn, $data['bio'] ?? '');
        $experience  = mysqli_real_escape_string($conn, $data['experience'] ?? '');
        $facebook    = mysqli_real_escape_string($conn, $data['facebook'] ?? '');
        $linkedin    = mysqli_real_escape_string($conn, $data['linkedin'] ?? '');
        $twitter     = mysqli_real_escape_string($conn, $data['twitter'] ?? '');
        $instagram   = mysqli_real_escape_string($conn, $data['instagram'] ?? '');

        $sql = "UPDATE teams SET 
                    name='$name',
                    $role_col='$role',
                    image_url='$image_url',
                    $address_col='$address',
                    phone='$phone',
                    email='$email',
                    $bio_col='$bio',
                    $experience_col='$experience',
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
        $id   = intval($params['id']);
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
