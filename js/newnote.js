class NewNote{
	constructor(elm,parent){
		this.elm=elm;
		this.member=parent;
		this.color="null";
		this.prepare();
		this.guess=new Population(10,0.03,this.member.data[this.member.data.length-1]);
	}
	prepare(){
		// prepare the color note button
		var btnColors=Array.from(elm("div#tool div#color span",this.elm,1));
		var input=Array.from(elm("input#title,textarea#text",this.elm,1));

		// show the previos note that not saved
		if(this.member.data[3].length){
			var TempNoteData=this.member.data[3].split("~");
			for(var i in input)
				input[i].value=TempNoteData[i];
		}
		let btn_save=elm("#tool  #save",this.elm);
		//prepare the color selection
		btnColors.forEach(btn=>btn.addEventListener("click",this.changeColor.bind(this)));
		//prepare the input behaiver 
		input.forEach(iput=>iput.addEventListener("keypress",this.inputKeyDown.bind(this,btn_save)));
		input.forEach(iput=>iput.addEventListener("input",this.inputKeyDown.bind(this,btn_save)));
		//prepare the save button
		btn_save.addEventListener("click",this.save.bind(this));
	}
	inputKeyDown(btn_save){
		// console.log(event.preventDefault());
		if((event.key||"").length<2&&event.type==="keypress"&&filterInput(event.key.toString())===false)
			event.preventDefault();
		if(event.type==="input"){
			var text=event.target.value.trim();
			var tempText="";
			for (var i = 0; i < text.length; i++){
				if(filterInput(text[i])===false)
					continue;
				tempText+=text[i];
			}
			if(tempText!=text){
				event.target.value=tempText;
			}
		}
		//scale the textarea 1ht 

		// if(event.target.tagName==="TEXTAREA")
		// 	event.target.style.height=
		// 	parseFloat(window.getComputedStyle(event.target)
		// 						.getPropertyValue("line-height"))*
		// 	event.target.value.split(/[\\n|\\n\\r|\\r]/).length+"px";


		//save note context as temp note only if the defferent bettween texts is big
		var currentext=event.target.value.trim().replace(/[\\n|\\n\\r|\\r]/,"")||"";

		var saveDelay=15//the number of changes must haping to text for auto saving 
		if(event.target.tagName==="TEXTAREA"&&currentext.length>40){
			/// proferm guess action using genitic algorithme
			if(event.type==="input"&&event.data==" "){
				console.log(event);
				// console.log(event);
				var norlmalise=(txt)=>txt.replace(/[\\n \\r\\n \\r \\. \\- #  \\']/gm," ");
				var strs=new Array();
				this.member.notes.forEach(n=>strs.push(norlmalise(n.content.text)));
				strs.push(norlmalise(event.target.value));
				strs=strs.map(str=>str.trim().split(" ")).filter(e=>e.length>2);
				
				if(this.guess.population[0].neighbor.keys().length){
					var target=strs[strs.length-1][strs[strs.length-1].length-1];
					this.guess.calcFitness(target);
					this.guess.selection();
					this.member.data[this.member.data.length-1]=this.guess.save();
				}
				 var guess=this.guess.action(strs);
				if(guess.guess){ //for showing the guess  
					//event.preventDefault();
					//event.target.value+=" "+guess.guess.trim();
					//selectText(event.target,event.target.value.length-guess.guess.length-1,event.target.value.length);
					//event.preventDefault();					
				}
			}



			if((currentext.length)%saveDelay==0){
				this.member.data[3]=event.target.previousElementSibling.value+"~"+event.target.value;
				this.member.saveNotes();
			}
		}else if(currentext.length<40&&this.member.data[3].length){
			this.member.data[3]="";
			this.member.saveNotes();
		}

		//hide/show the save button
		var input=Array.from(elm("input#title,textarea#text",this.elm,1));
		if(input[0].value.trim().length>=5&&input[1].value.trim().length>=10)
			fade(btn_save,1);
		else fade(btn_save,0);

	}

	changeColor(e){
		var target=e.target;
		this.elm.classList.remove(this.color);
		if(this.color!=target.classList[0]){
			this.color=target.classList[0];
			this.elm.classList.add(this.color);
		}else this.color="none";
	}

	save(e){

		// delete any temp note that note saved from the cach:i means current
		this.member.data[3]="";
		var title=elm("#title",this.elm);
		var text=elm("#text",this.elm);
		if(!title.value||title.value.trim().length<5||title.value.indexOf("|")>-1||title.value.indexOf("~")>-1||title.value.indexOf("ŧ")>-1){
			var tempColor=window.getComputedStyle(title)
								.getPropertyValue("border-color");
			title.style.borderColor="red";
			setTimeout(()=>title.style.borderColor=tempColor,2000);
		}else if(!text.value||text.value.trim().length<5||text.value.indexOf("|")>-1||text.value.indexOf("~")>-1||text.value.indexOf("ŧ")>-1){
			var tempColor=window.getComputedStyle(text)
								.getPropertyValue("border-color");
			text.style.borderColor="red";
			setTimeout(()=>text.style.borderColor=tempColor,2000);
		}else{
			///save note and create a div
			test=text.value;
			this.member.notes.unshift(new Note(title.value.trim(),text.value.trim(),this.color,new Date(),this.member));
			this.member.saveNotes();
			text.value="";
			title.value="";
			this.elm.classList.remove(this.color);
			this.color="null";
			
		}
	}
}
