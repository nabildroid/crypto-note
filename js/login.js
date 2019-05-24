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
				var data=name+"|"+now+"|"+this.HelloWorld()+"|"+"|";
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

	HelloWorld(){
		var title="مرحبا بالعالم";
		var text=`مرحبا بك في تطبيق مذكة ونشكرك على انشاء حسابك في هذه الخدمة المجانية \nمذكرة هو تطبيق ويب يتيح لك انشاء ملاحظات او تدوينات يومية بشكل سهل جدا مع خصوصية كبيرة حيث ما ييميزه هو\nعدم تواجد قاعدة بيانات مركزية ومخفية عن كل الزوار بل قاعدة بياناته متاحة لكل الزوار ولاكن بشكل مشفر وسري\nويكون التشفير فريد من نوعه من مستخدم لاخر وهاذا عن طريق استعمال كلمة المرور الحساب في عملية تشفيير وبهاذا فان ما يخزن في \nقاعدة البيانات هو اسم المستخدم وليس كلمة مروره\n\n\nيمكن اظافة تنسيقات لملاحظاتك عن طريق البدء برموز معينة وهذه لائحة بالتنسيقات الممكنة\n\n'نص غليض' و هذا عادي \n- العنصر الاول من القائمة\n- العنصر الثاني من القائمة\n\nويمكنك زيارة http://localhost او https://localhost\nهذه التدوينة في قسم #Hello_World \n\nكما يمكنك الضغط مرتين لرئية الرموز المستخدمة لتنسيقات وايضا التعديل على محتوى الملاحظة\nاو الضغط مرتين لتعديل العنوان ايضا\nوان حدث وكتبت ملاحظة تحتوي اكثر من 40 حرف وبالخطء قمت بتحديث الموقع او الخروج منه \nفلا تقلق فعند زيارتك للموقع مجددا ستجدها بانتظارك \nاذن ماذا تنتظر هيا جرب كل تلك الخصائص واستمتع\n`;
		return [title,text,"yellow",new Date()].join("~");
	}
}


