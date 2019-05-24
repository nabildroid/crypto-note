var test;
var connect;
var login;
var user_content;
var db;
var CRYPTO;
var member;
let  t;
window.addEventListener("DOMContentLoaded",()=>{
	Array.from(elm("body > div","",1)).pop().remove()
	connect=new Ajax("../note.php","POST");
	CRYPTO=new Crypto;

	fade(elm(".login"),1).then(()=>{
		login=new Login(elm(".login"),connect);
	});


	// connect.send({},"GET").then(txt=>{
	// 	db=txt.split("¤");
	// 	return new Promise((r)=>setTimeout(r,1000));
	// }).then(()=>{
	// 	
	// 	return fade(elm(".loader"),0);
	// }).then(()=>);

});
