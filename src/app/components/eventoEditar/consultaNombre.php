<?php
    require("../headers.php");
    require("../conexion.php");
    $conexion = conexion();

    $nombre = mysqli_real_escape_string($conexion, $_GET['nombre']);
    $id = mysqli_real_escape_string($conexion, $_GET['id']);

    class Result {}

    $response = new Result();

    if(isset($id)){
        $response->resultado = 1;
    }
    else{
        $response->resultado = 0;
    }

    echo json_encode($response);
?>
