let version="1.4.9";
self.addEventListener("install",(event)=>{
	event.waitUntil(
		caches.open("note-"+version).then(async cach=>{
			cach.addAll([
				"./",
				"./index.html",
				"./js/functions.js",
				"./js/member.js",
				"./js/login.js",
				"./js/crypto.js",
				"./js/control.js",
				"./js/newnote.js",
				"./js/note.js",
				"./js/hashtag.js",
				"./js/guess.js",
				"./js/translate.js",
				"./js/translate.json",
				"./style/color.css",
				"./style/phone.css",
				"./style/style.css"
			]);
		}).then(()=>{
			self.skipWaiting();
		})
	);
})
self.addEventListener("activate",(event)=>{
	event.waitUntil(
		caches.keys().then(ks=>{
			return Promise.all(ks.map(k=>{
				if(k!="note-"+version){
					caches.delete(k);
				}
			}));
		})
	);
})

self.addEventListener("fetch", (event)=>{
	event.waitUntil(
		event.respondWith(treatFetch(event))
	)
})




async function  treatFetch(event) {
	//clone the body of the request if it for db
	var txt;
	if(event.request.url.search(".php")!=-1){
		var TempRequest=event.request.clone();
		txt=null;
		try{
			txt=await TempRequest.text();
			txt=decodeURIComponent(txt).slice(4,txt.length);
		}catch(e){console.error(e)}
	}
	return caches.open("note-"+version).then(async cach=>{
		if(event.request.url.search(".php")==-1){
			let responseFcach=await cach.match(event.request);
			if(responseFcach)return responseFcach;
		}
		return fetch(event.request).then(async res=>{
			if(event.request.url.search(".php")!=-1){ //request for noteDatabase
				var checkOld= await cach.match('must_update'); 
				if(checkOld){ //there's old change when app was offline
					//save old notedatabase from cach
					var dbPath=await  checkOld.text();
					var Oldnote=await cach.match("/note.php");
					Oldnote=await Oldnote.text();
					await fetch(event.request.url+dbPath, {
						    method: 'POST',
						    headers: {
						      'Content-Type': 'application/x-www-form-urlencoded'
						    },
						    body:"set="+encodeURIComponent(Oldnote)
						  });
					await cach.delete(new Request("must_update"));//delete the trigger of old change
					return new Response(Oldnote);//return data from cach
				}
				await cach.put(new URL(event.request.url).pathname,res.clone());
				return res;
			}
			return res;
		//offline
		}).catch((ere)=>{ 
			return (caches.open("note-"+version)
				.then(async cach=>{
					if(event.request.url.search(".php")!=-1){
						let dbPath=new URL(event.request.url).search;
						if(txt){
							await cach.put(new Request(new URL(event.request.url).pathname),new Response(txt));
							await cach.put(new Request("must_update"),new Response(dbPath));
						}
						return await cach.match(new URL(event.request.url).pathname);
					}
					return await cach.match(event.request.url);
				})
			);
		})
	});
}


