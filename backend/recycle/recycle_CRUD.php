<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$map = [
  'projects'  => 'projects',
  'news'      => 'news',
  'donations' => 'donations',
  'teams'     => 'teams',
  'feedbacks' => 'donors_feedbacks'
];
$resource = $_GET['resource'] ?? '';
if (!isset($map[$resource])) { http_response_code(400); echo json_encode(['status'=>'error']); exit; }
$table = $map[$resource];
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'GET':
    $res = mysqli_query($conn, "SELECT * FROM `$table` WHERE isDeleted = 1");
    $data = [];
    while ($row = mysqli_fetch_assoc($res)) $data[] = $row;
    echo json_encode(['status'=>'success', 'data'=>$data]);
    break;
  case 'PUT':
    parse_str($_SERVER['QUERY_STRING'], $q); $id = intval($q['id'] ?? 0);
    mysqli_query($conn, "UPDATE `$table` SET isDeleted = 0 WHERE id = $id");
    echo json_encode(['status'=>'success']); break;
  case 'DELETE':
    parse_str($_SERVER['QUERY_STRING'], $q);
    if (!empty($q['all'])) {
      mysqli_query($conn, "DELETE FROM `$table` WHERE isDeleted = 1");
    } else {
      $id = intval($q['id'] ?? 0);
      mysqli_query($conn, "DELETE FROM `$table` WHERE id = $id");
    }
    echo json_encode(['status'=>'success']); break;
  default:
    http_response_code(405); echo json_encode(['status'=>'error']); break;
}
