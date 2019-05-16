let transilate;
window.addEventListener("DOMContentLoaded",async ()=>{
	transilate=await fetch("js/translate.json");
	transilate=await transilate.json();
	compressor=compressor.map( file=>{
		for(let key in transilate)
			file=file.replace(new RegExp("("+key+")","g"),transilate[key]);
			
			file=file.replace(/\/\n\//g,"\/\\\\n\/");
			file=file.replace(/"\n"/g,'"\\n"');
			file=file.replace(/'\n'/g,"'\\n'");
			let script=document.createElement("script");
			script.appendChild(document.createTextNode(file));
			document.head.appendChild(script);

		return file;
	});
		

	prepareApp();



});