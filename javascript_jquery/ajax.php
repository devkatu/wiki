<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['txt1'])){

  $r = array(
    'mes' => htmlspecialchars($_GET['txt1'] , ENT_QUOTES , "utf-8"),
    'len' => strlen($_GET['txt1']),
    'rtn' => 'GETされました'
  );
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($r);

}else if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $rtn = htmlspecialchars($_POST['txt2'] , ENT_QUOTES , "utf-8");
  echo '<div class="box">';
  echo '<p class="desc">'. $rtn . '</p>';
  echo '</div>';
  echo 'POSTされました';
}else {
  echo '<div class="box">';
  echo '<p class="desc"></p>';
  echo '</div>';
  echo 'ページをロードしました';
}
?>
