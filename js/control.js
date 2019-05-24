var test;
var connect;
var login;
var user_content;
var db;
var CRYPTO;
var member;
let  t;
window.addEventListener("DOMContentLoaded",()=>{
	connect=new Ajax("https://pfalgeria2018.000webhostapp.com/note.php","POST");
	CRYPTO=new Crypto;

	fade(elm(".login"),1).then(()=>{
		login=new Login(elm(".login"),connect);
	});
});
