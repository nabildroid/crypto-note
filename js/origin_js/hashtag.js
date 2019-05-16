class Hashtag{
	constructor(hashtags,parent){
		this.hashtags=hashtags;
		this.member=parent;
		this.elm=elm("div#hashtages");
		this.show();
	}
	show(){
		var hashtagElement=document.createElement("div");
		var b=document.createElement("button");
		b.classList.add("all");b.innerHTML="الكل";
		b.addEventListener("click",this.set.bind(this,undefined));
		hashtagElement.appendChild(b);
		for(var i in this.hashtags){
			var h=this.hashtags[i];
			b=document.createElement("button");
			b.innerHTML=h;
			hashtagElement.appendChild(b);
			b.addEventListener("click",this.set.bind(this,i));
		}
		this.elm.appendChild(hashtagElement)
		fade(this.elm,1).then(()=>{
			this.member.notes_div.style.minHeight=this.elm.offsetHeight+"px";
		});

	}
	async set(i){
		var target=[];
		var notarget=[];
		for (var note of this.member.notes) {
			if(!i||note.hashtag.indexOf(parseInt(i))!=-1){
				if(target.indexOf(note)==-1)target.push(note);
				fade(note.elm,1);
			}
			else {
				notarget.push(note);
				fade(note.elm,0);
			}
		}	
		alignNotes(target,this.member.notes_div);
	}

}