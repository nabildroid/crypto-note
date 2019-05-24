class Member{
	 constructor (name,pass,dbPath,data)  {
		CRYPTO.setCodeList(name,pass);

		this.user={name:name,pass:pass,dbPath:dbPath};
		//data pattren [name,time,note,oldnote,GA property] 
		this.data=data;
		this.elm=elm(".Member");
		
		this.notes_div=elm("#notes",0,this.elm);
		this.notes=new Array();

		this.hashtag=[];
		this.newNote;
		this.show()
		this.showNotes();
		this.updateLastSession();
	}
	show(){
		elm("#username",this.elm).innerHTML=this.user.name;
		elm("#lastSession",this.elm).innerHTML=getDate(this.data[1]);
		return fade(this.elm,1).then(()=>{
			//prepare for new notes
			this.newNote=new NewNote(elm("#new",this.elm),this);
			return this;
		});
	}	
	updateLastSession(){
		var now=new Date()
		this.data[1]=now;
		var data=this.data.join("|");
		data+="|"+hash(data);
		data=CRYPTO.crypt(data);
		this.saveNotes();
	}
	async saveNotes(){ // for save all notes 
		var notes="";
		this.notes.forEach(n=>notes+="ŧ"+n.join());
		this.data[2]=notes.slice(0,notes.length-1);
		var data=this.data.join("|");
		// test=data;
		data+="|"+hash(data);
		data=CRYPTO.crypt(data);
		this.loader();
		await connect.send({set:data},"",this.user.dbPath)
					 .then(()=>this.loader(1)).catch(()=>{
					 	this.loader(2);
					 	setTimeout(()=>this.saveNotes(),1000);
					 });
		alignNotes(this.notes,this.notes_div);

	}
	async showNotes(){
		await this.data[2].split("ŧ").filter(e=>e.length).forEach(noteINFO=>{
			noteINFO=noteINFO.split("~");
			var note=new Note(...noteINFO,this);
			this.notes.push(note);

			//check if there any hash in the content if note
			var hashtag=null;
			for(var i=0;i<note.content.text.length;i++){
				var temp="";
				if(note.content.text[i]==="#"){
					for (var j = i+1; j <note.content.text.length; j++) {
						if(note.content.text[j]==" "||note.content.text[j]=="\\n")break;
						temp+=note.content.text[j];
					}
					i=j;
					if(this.hashtag.indexOf(temp)!=-1)
						hashtag=this.hashtag.indexOf(temp);
					else {this.hashtag.push(temp);hashtag=this.hashtag.length-1;}
					note.hashtag.push(hashtag);
				}
			}
		});
		alignNotes(this.notes,this.notes_div);
		if(this.hashtag.length){
			this.hashtag=new Hashtag(this.hashtag,this);
		}
	}
	loader(state=0){//state 0: show 1:good-hide 2:error-hide 
		if(!state)
			elm("#load",this.elm).style.display="inline-block";
		else {
			elm("#load",this.elm).classList.add(state==1?"good":"error");
			setTimeout(()=>{
				elm("#load",this.elm).classList.remove("error","good");
				elm("#load",this.elm).style.display="none";
			},500);
		}

	}
}