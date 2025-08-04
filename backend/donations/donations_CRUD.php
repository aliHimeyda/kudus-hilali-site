<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

require_once "../db.php";

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT id, project_id, donor_name, donor_email, phone, city, honor_name, amount, donation_date, isDeleted FROM donations";
        $result = mysqli_query($conn, $sql);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = mysqli_prepare($conn,
            "INSERT INTO donations (project_id, donor_name, donor_email, phone, city, honor_name, amount, donation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param(
            $stmt,
            'isssssds',
            $input['project_id'],
            $input['donor_name'],
            $input['donor_email'],
            $input['phone'],
            $input['city'],
            $input['honor_name'],
            $input['amount'],
            $input['donation_date']
        );
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['status' => 'success', 'id' => mysqli_insert_id($conn)]);
        } else {
            echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
        }
        break;

    case 'PUT':
        parse_str(parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY), $query);
        $id = intval($query['id'] ?? 0);
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = mysqli_prepare($conn,
            "UPDATE donations SET project_id=?, donor_name=?, donor_email=?, phone=?, city=?, honor_name=?, amount=?, donation_date=? WHERE id=?");
        mysqli_stmt_bind_param(
            $stmt,
            'isssssisi',
            $input['project_id'],
            $input['donor_name'],
            $input['donor_email'],
            $input['phone'],
            $input['city'],
            $input['honor_name'],
            $input['amount'],
            $input['donation_date'],
            $id
        );
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
        }
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        $stmt = mysqli_prepare($conn, "UPDATE donations SET isDeleted=1 WHERE id=?");
        mysqli_stmt_bind_param($stmt, 'i', $id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
        break;
}