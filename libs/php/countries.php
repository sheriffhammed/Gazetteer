<?php
$executionStartTime = microtime(true);
if (file_exists('../geojson/countryBorders.geo.json')) {
    $filename = '../geojson/countryBorders.geo.json';
    $data = file_get_contents($filename); //data read from json file
    //print_r($data);
    $countries = json_decode($data); //decode a data
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $countries;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
} else {
    $message = "<h3 class='text-danger'>JSON file Not found</h3>";
}




?>