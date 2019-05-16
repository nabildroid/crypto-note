<?php 
if(isset($_GET["folder"])&&isset($_GET["file"])){
	$folder=intval($_GET["folder"]);
	$file=$_GET["file"];
	$filePath="./note/dataNote/".$folder."/".$file.".txt";
	if(file_exists($filePath)){
		if(isset($_POST["set"]))
			file_put_contents($filePath,$_POST["set"]);
		echo file_get_contents($filePath);
		exit;
	}else
		if(isset($_POST["set"])&&strlen($_POST["set"])>10){
			if($folder>0&&$folder<100){
				if(!is_dir("./note/dataNote/".$folder))
					mkdir("./note/dataNote/".$folder);
				file_put_contents($filePath,$_POST["set"]);
				exit;
			}
		}
}
echo "error";
?>