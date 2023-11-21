<?php

// remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&appid=33c8219f1dd1996bc7eff7d8690f8f8a';
//echo "The reqs url " . $url;
//die;
//$url = 'https://api.openweathermap.org/data/2.5/forecast?lat=51.5320327&lon=-0.573809&appid=33c8219f1dd1996bc7eff7d8690f8f8a';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$new_weather_list = [];
if (is_array($decode['list']) && count($decode['list']) > 0) {
	$x = 0;
	for ($i = 0; $i <= count($decode['list']) - 1; $i++) {
		$arrVal = substr($decode['list'][$i]['dt_txt'], 0, 10);
		if (in_array($arrVal, array_keys($new_weather_list))) {
			array_push($new_weather_list[$arrVal], $decode['list'][$i]);
		} else {
			$new_weather_list[$arrVal][0] = $decode['list'][$i];
		}

	}
}
$dailyWeatherForecast = [array_key_first($new_weather_list) => $new_weather_list[array_key_first($new_weather_list)]];
// echo "<pre>";
// print_r($dailyWeatherForecast);
// echo "</pre>";
// die("stop");
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $dailyWeatherForecast;

header('Content-Type: application/json; charset=UTF-8');


echo json_encode($output);

?>