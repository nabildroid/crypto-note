class Login{
	constructor(div,connect){
		this.elm=div;
		this.connect=connect;
		elm("button#login",this.elm)
			.addEventListener("click",this.submit.bind(this,"login"));
		elm("button#beMember",this.elm)
			.addEventListener("click",this.submit.bind(this,"beMember"));
	}
	checkValide(name,pass){
		var Uname=name.value.toString();
		var Upass=pass.value.toString();
		if(!Uname||Uname.trim().length<5)
			return {elm:name,content:"username must containes more than 5 letters"};
		else if(!Upass||Upass.trim().length<5)
			return {elm:pass,content:"password must containes more than 5 letters"};
		else return true;
	}
	submit(type){
		var username=elm("#username",this.elm);
		var password=elm("#pass",this.elm);
		var validity=this.checkValide(username,password);
		if(validity!=true){
			var tempColor=window.getComputedStyle(validity.elm)
								.getPropertyValue("border-color");
			validity.elm.style.borderColor="red";
			setTimeout(()=>validity.elm.style.borderColor=tempColor,2000);
		}else{
			elm(".login").classList.add("wait");
			var index=hash_position(username.value.trim(),100);					
			if(type=="login")
				   this.login(username.value,password.value,index);
			else this.beMember(username.value,password.value,index);
		}
	}
	login(name="",pass="",index,fromNewLogin=0){
		connect.send({},"",this.DBPath(name,pass,index)).then(data=>{
			if(data=="error") return this.noti();
			data=CRYPTO.decrypt(data,name,pass);
			data=data.split("|");
			// check if the hash is true;
			var tempHash=parseInt(data.pop());
			var Ccurrent=data.join("|");

			if(data[0]===name){
				if(tempHash==hash(Ccurrent)){
					this.noti("",1);
					fade(this.elm,0).then(()=>{
						member=new Member(name,pass,this.DBPath(name,pass,index),data)
						// member.then((m)=>{
						// 	if(fromNewLogin)
						// 		m.notes.newNOTE(...helloWorld());
						// });
					});					
				}else this.noti("حسابك معدل بشكل خاطئ");
			}else this.noti("هذا ليس حسابك");

		}).catch(e=>this.noti("خطء في الاتصال"));
	}
	
	beMember(name,pass,index){
		connect.send({},"",this.DBPath(name,pass,index)).then(data=>{
			if(data=="error"){
				var now=new Date()
				//current pattren [name,time,note,oldnote,GA property] 
				var data=name+"|"+now+"|"+"|"+"|";
				data+="|"+hash(data);		
				data=CRYPTO.crypt(data,name,pass);
				connect.send({set:data},"",this.DBPath(name,pass,index)).then(()=>{
					this.noti("تم انشاء حسابك "+name,1);
					// this.login(name,pass,tempIndex,1);
				}).catch(e=>this.noti("خطء في الاتصال"));
			}else this.noti("هذا الحساب خاطئ");
		}).catch(e=>this.noti("خطء في الاتصال"));
	}
	DBPath(name,pass,index)
		{return "?folder="+index+"&file="+hash(name+pass);}

	noti(msg="هذا الحساب غير موجود",state=0){
		if(msg)noti(msg,state);
		elm(".login").classList.add(state?"good":"error","hide");
		elm(".login").setAttribute("disabled","true");
		setTimeout(()=>{
			elm(".login").classList.remove(state?"good":"error","hide","wait");
			elm(".login").removeAttribute("disabled");
		},3000);
	}
}


