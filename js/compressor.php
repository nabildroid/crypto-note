<?php 
ob_start();
header("Content-type: application/javascript; charset=utf-8");

$source=file_get_contents("./".($_GET["file"]!="translate"?"origin_js/":"").$_GET["file"].".js");

if($_GET["file"]!="translate"){
	$translate=json_decode(file_get_contents("./translate.json"));
	foreach ($translate as $key => $value )
		$source=str_replace($value,$key, $source);

	$source=preg_replace("/`/","\`",$source);
	# $source=preg_replace("/\/\/(.(?!(\"|')))*$/","",$source); //delete all comments
	$source="compressor.push(`".$source."`);";

}
echo $source;



?>