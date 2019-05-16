
class Note{
	constructor(title,text,color,time,parent){
		this.content={title:title,text:text,color:(color||""),time:(time||new Date())};
		this.member=parent;
		this.elm;
		this.hashtag=[];
		this.show();
	}

	show(){// fore showing all saved notes
		this.createELM().then((div)=>{
			this.elm=div;
			this.prepare();
			this.elm.classList.add(detectLanguage(this.content.text)=="ar"?"right":"left");

			fade(this.elm,1,"inline-block");
			// this.alignNote(note);
		})
	}
	join(){
		return this.content.title+"~"+this.content.text+"~"+
				this.content.color+"~"+this.content.time;
	}


	//prepare the element of  note for action like delete and update
	prepare(){
		//prapare the delete button
		this.elm.querySelector("button#delete").addEventListener("click",this.delete.bind(this));
		
		//prepare update title and text;
		this.elm.addEventListener("dblclick",this.update.bind(this,event),1);
	}

	async update(){
		var current=event.target;
		if(current.tagName=="INPUT"||current.tagName=="TEXTAREA")return false;
		if(current.tagName=="DIV")current=current.parentElement;
		var type=current.getAttribute("id")
		var newInput=document.createElement(type=="title"?"input":"textarea");
		newInput.setAttribute("id",type);
		// console.log(this.member.notes.reverse()[Array.from(this.elm.children).indexOf(div)].split("~")[1]);
		//show save button that hold the  blur action
		let btn_save=elm("#save",this.member.notes_div);
		btn_save.click();
		btn_save.style.display="inline-block";
		btn_save.addEventListener("click",()=>event.target.blur());
		btn_save.classList.add(this.content.color);

		var noteContent=null;
		var indexOfNote=this.member.notes.indexOf(this);
		noteContent=this.content[type];
		newInput.value=noteContent
		newInput.style.display="none";
		newInput.style.minHeight=current.offsetHeight+"px";
		this.elm.insertBefore(newInput,current);
		await fade(event.target,0);
		fade(newInput,1);
		newInput.focus();
		var PreventBadKey=(e)=>{
			if((e.key||"").length<2&&e.type==="keypress"&&filterInput(e.key.toString())===false)
				e.preventDefault();
			if(e.type==="input"){
				var text=e.target.value.trim();
				var tempText="";
				for (var i = 0; i < text.length; i++){
					if(filterInput(text[i])===false)
						continue;
					tempText+=text[i];
				}
				if(tempText!=text)
					e.target.value=tempText;
			}
		}
		newInput.addEventListener("keypress",PreventBadKey.bind(event));
		newInput.addEventListener("input",PreventBadKey.bind(event));
		newInput.addEventListener("blur",async (inp)=>{
			//hide save button;
			btn_save.style.display="none";
			btn_save.classList.remove(this.content.color);

			if(inp.target.value.length-1<5){
				inp.target.remove();fade(event.target,1);return false;
			}
			if(type=="text")
				current.replaceChild(ApplayTemplate(inp.target.value),current.children[0]);
			else current.innerHTML=inp.target.value;

			event.target.remove();
			fade(current,1);
			//save notes
			this.content[type]=inp.target.value;
			this.content.time=(new Date).toString();
			this.member.saveNotes();
		})
	};

	delete(){// for delete special note according to time of saving
		fade(this.elm,0).then(e=>e.remove());
		this.member.notes.splice(this.member.notes.indexOf(this),1);
		this.member.saveNotes();
	}

	createELM(){ //create new HTML for each note and if note is new save it ,,param for add attribute to this new note DIV
		// <div id="note"><h3></h3><p></p></div>
		return new Promise(resolve=>{
			var note=document.createElement("div");
			note.setAttribute("id","note");
			if(this.content.color)note.classList.add(this.content.color);
			var titleELM=document.createElement("h3");
			titleELM.setAttribute("id","title");
			var titleTXT=document.createTextNode(this.content.title);
			titleELM.appendChild(titleTXT);
			var textELM=document.createElement("p");
			textELM.setAttribute("id","text");
			textELM.appendChild(ApplayTemplate(this.content.text));
			note.appendChild(titleELM);
			note.appendChild(textELM);
			///////////ADD TOOL
			var tool=document.createElement("div");
			tool.setAttribute("id","tool");
			var wrapper=document.createElement("div");
			tool.appendChild(wrapper);
			var toolBtn=document.createElement("button");
			toolBtn.setAttribute("id","delete");
			var toolBtnTXT=document.createTextNode("حذف");
			toolBtn.appendChild(toolBtnTXT);
			var toolSpan=document.createElement("span");
			toolSpan.setAttribute("timeCreated","delete");
			var toolSpanTXT=document.createTextNode(getDate(this.content.time));////////////////////////timeCreate
			toolSpan.appendChild(toolSpanTXT);
			wrapper.appendChild(toolBtn);
			wrapper.appendChild(toolSpan);
			note.appendChild(tool);

			note.style.display="none";
			var firstNoteELM=this.member.notes[0];
			if(firstNoteELM)
				this.member.notes_div.insertBefore(note,firstNoteELM.elm);
			else this.member.notes_div.appendChild(note);

			resolve(note);
		});
	}
}

