class Ajax{
	constructor(url,method){
		this.url=url;
		this.method=method.toUpperCase();
		this.http=new XMLHttpRequest
	}
	send(p={},method=this.method,appendUrl=""){
		method=method||this.method
		var url=this.url+appendUrl;
		var parameter="";
		for(var name in p){
			parameter+=name+"="+encodeURIComponent(p[name])+"&";
		}
		parameter=parameter.slice(0,parameter.length-1);
		url+=(method=="GET"&&parameter)?"?"+parameter:"";
		this.http.open(method,url);
		this.http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		// this.http.addEventListener("progress",event=>{
		// 	let p=event.loaded ;
		// 	pogressFCT(event,p);
		// });

		this.http.send(method=="POST"?parameter:0);
		return new Promise((resolve,reject)=>{
			this.http.onloadend=resolt=>resolve(resolt.target.responseText);
			this.http.onerror=resolt=>reject(resolt.target.statusText);
		});
	}
}
function elm(tag,parent=document,all){
	if(!parent)parent=document;
	if(tag.charAt(0)=="."&&parent.getElementsByClassName)
		tag=parent.getElementsByClassName(tag.slice(1,tag.length));
	else if(tag.charAt(0)=="#"&&parent.getElementById)
		tag=parent.getElementById(tag.slice(1,tag.length));
	else tag=parent.querySelectorAll(tag);

	if(all)return tag
		else return tag[0];
}
function fade(elm,show=0,display="block"){
	if(show&&elm.style.display!="none"&&elm.style.display!=""&&parseFloat(elm.style.opacity)>0.9)return Promise.resolve();
	elm.style.opacity=show?0:1;
	show?(elm.style.display=display):(null);
	return new Promise(resolve=>{
		var d=setInterval(()=>{
			elm.style.opacity=parseFloat(elm.style.opacity)+(0.03*(show?1:-1));
			if(elm.style.opacity<0||elm.style.opacity>1){
				if(elm.style.opacity<0)elm.style.display="none";
				clearInterval(d);
				resolve(elm);
			}
		},10);
	});
}
function getDate(date){
	parse=(d)=>{return{y:(d.getFullYear()-2000),m:d.getMonth(),d:d.getDate(),H:d.getHours(),M:d.getMinutes(),S:d.getSeconds()}};
	var o=parse(new Date(date));
	var n=parse(new Date());
	if(o.m==n.m){
		if(o.d==n.d){
			if(o.H==n.H){
				if(o.M==n.M){
					return "الان";
				}else return Math.abs(o.M-n.M)+" دقيقة";;
			}else return Math.abs(o.H-n.H)+" ساعة";
		}else return Math.abs(o.d-n.d)+" يوم";
	}
	return o.y+"/"+o.m+"/"+o.d+" "+o.H+"-"+o.M+"-"+o.S;
}


function noti(txt,state=1){
	let e=elm("div#noti");
	e.innerHTML=txt;
	e.classList.add(state?"good":"error");
	e.style.display="block";
	setTimeout(()=>{
		e.classList.remove(state?"good":"error");
		e.style.display="none";
	},3000);
}




alignNotes=function(notes,wrapper){
	var width=wrapper.offsetWidth;
	if(width<600)return false;
	var alignotes=[[],[]];
	notes.forEach(note=>{
		var currentHeight=note.elm.offsetHeight;
		var tempHeight=[0,0];
		alignotes[0].forEach(h=>tempHeight[0]+=h);
		alignotes[1].forEach(h=>tempHeight[1]+=h);
		if(tempHeight[0]<=tempHeight[1]){// right
			note.elm.style.left="50%";
			note.elm.style.top="calc( 1em * "+(alignotes[0].length)+" + "+tempHeight[0]+"px )";
			alignotes[0].push(currentHeight)
		}else{
			note.elm.style.top="calc( 1em * "+(alignotes[1].length)+" + "+tempHeight[1]+"px )";
			note.elm.style.left="0";
			alignotes[1].push(currentHeight);
		}
	});
	wrapper.style.height="calc( 1em * "+(alignotes[0].length + alignotes[1].length)+" + "
					 +(som(alignotes[0])>som(alignotes[1])?som(alignotes[0]):som(alignotes[1]))+"px )";
};

function som(a){
	var s=0;
	a.map(e=>s+=e);
	return s;
}


detectLanguage  =function (txt){//for detecting the language of content either AR or EN 
	var letter=Crypto.Letter();
	var Ar=[letter.ARletter,0];
	var En=[letter.az.concat(letter.AZ),0];
	for(var i in txt){
		if(Ar[0].indexOf(txt[i])!=-1)
			Ar[1]++;
		else if(En[0].indexOf(txt[i])!=-1)
			En[1]++;
	}
	return Ar[1]>En[1]?"ar":"en";
}

ApplayTemplate=function(txt){ //applay some transforme to orign note content to be a html like hashtag url liste 
	var  beHashed=text=>{
		let createElM=(t)=>{
			t=t.replace(/_/gm," ")
			var e=document.createElement("span");
			e.classList.add("hashtag");
			e.appendChild(document.createTextNode(t));
			return e;
		}
		var temp=new Array();
		var t="";
		for (var i = 0; i < text.length; i++) {
			if(text[i]=="#"){
				if(t.length>1&&t.charAt(0)=="#")temp.push(createElM(t.slice(1)));
				else if(t)temp.push(t);
				t="#";
			}else if((text[i]==" ")&&t.length>1&&t.charAt(0)=="#"){
				temp.push(createElM(t.slice(1)));
				t="";
			}else t+=text[i];
		}
		if(t.length){
			if(t.length>1&&t.charAt(0)=="#")temp.push(createElM(t.slice(1)))
			else temp.push(t);
		}
		return temp;
	}
	var beBold=text=>{
		text=text.split("'");
		var temp=new Array();
		for (var i = 0; i < text.length; i++) {
			if(i%2!=1){temp.push(text[i]);continue}
			var elmBlod=document.createElement("strong");
			elmBlod.appendChild(document.createTextNode(text[i]));
			temp.push(elmBlod);
		}
		return temp;
	}

	let beUrl=text=>{
		var temp=new Array("");
		let createElM=(url)=>{
			let e=document.createElement("a");
			e.appendChild(document.createTextNode(url));
			e.setAttribute("href",url)
			e.setAttribute("target","_blank")
			return e;
		}
		for (var i = 0; i < text.length; i++) {
			if(text.slice(i,i+7)=="http://"||text.slice(i,i+8)=="https://"){
				temp.push("http");
				i+=3;
				continue;
			}else if(temp[temp.length-1].slice(0,4)=="http"&&text[i]==" "){
				temp.push("");
				continue;
			}else temp[temp.length-1]+=text[i];
		}
		temp=temp.filter(e=>e.length).map(e=>{
			if(e.slice(0,7)=="http://"||e.slice(0,8)=="https://")
				return createElM(e);
			else return e;
		});
		return temp;
	}

	let applayBOLD_HASHED_URL=text=>{
		text=beBold(text);
		for(let i=0;i<text.length;i++){
			if(typeof(text[i])=="string"){
				let h=beHashed(text[i]);
				text[i]=h.shift();
				for(let other of h)
					text.splice(i+(h.indexOf(other))+1,0,other);
			}
		}
		for(let i=0;i<text.length;i++){
			if(typeof(text[i])=="string"){
				let u=beUrl(text[i]);
				text[i]=u.shift();
				for(let other of u)
					text.splice(i+(u.indexOf(other))+1,0,other);
			}
		}
		return text
	}

	txt=txt.replace(/\\n/gm," | ");
	txt=txt.split(" ");
	// txt=txt.filter(e=>e.length);
	var resolte=document.createElement("div");

	///////fisrt dealing with the list  
	for (var i = 0; i < txt.length; i++) {
		if(!txt[i])continue;
		var tempI=i;
		if((i==0||txt[i-1]=="|")&&txt[i].charAt(0)=="-"){
			let elm=document.createElement("ul");
			while((i==0||txt[i-1]=="|")&&txt[i].charAt(0)=="-"){
				let tempItem=txt[i].slice(1);
				for (var j = i+1; j < txt.length; j++)
					if(txt[j]=="|")break;
					else tempItem+=" "+txt[j];
				if(tempItem){
					let li=document.createElement("li");
					li.appendChild(document.createTextNode(tempItem.trim()))
					elm.appendChild(li);
				}
				i=j+1;
			}
			// for set undefined the element that exist in UL element
			for(var s=tempI;s<i;s++)
				txt[s]=undefined;
			txt[tempI]=elm;
			resolte.appendChild(elm);
		}
	}
	txt=txt.filter(e=>e);
	let temp=new Array("");
	for(var t of txt){
		if(typeof(t)!="object"){
			if(temp.length&&typeof(temp[temp.length-1])=="object")
				temp.push("");
			temp[temp.length-1]+=" "+(t=="|"?"\n":t);
		}else temp.push(t);
	}
	temp=temp.map(elm=>{
		if(typeof(elm)=="object"){
			Array.from(elm.children).forEach(li=>{
				let TEXTLI=li.textContent;
				li.innerHTML="";
				applayBOLD_HASHED_URL(TEXTLI).forEach(tmp=>{
					if(typeof(tmp)==="object")
						li.appendChild(tmp)
					else li.appendChild(document.createTextNode(tmp)); 
				});
			})			
			return elm;			
		}else return elm;

	});
	for (let i = 0; i < temp.length; i++) {
		if(typeof(temp[i])=="string"){
			let tmp=applayBOLD_HASHED_URL(temp[i]);
			temp[i]=null;
			for(let t of tmp)
				if(t)
					temp.splice(i+(tmp.indexOf(t))+1,0,typeof(t)=="string"?document.createTextNode(t):t);
		}
	}
	// console.log(temp);
	temp.map(t=>{
		if(t)
		resolte.appendChild(t);
	})


	// dealing with blod effect
	
	return resolte;
	
}





// for filter the infput like prevent |\ and return the input if it good or return null if it bad
filterInput=function(i){
	var accepted=["Enter","\n"];
	var letters=Crypto.Letter();
	accepted=accepted.concat((letters.AZ)
					 .concat((letters.az)
					 .concat(letters.ARletter)
					 .concat((letters.number)
					 .concat(letters.symbol1))));
	return accepted.indexOf(i)!=-1?i:false;
}
//
getCurrectWord=function(txt){
	var letters=Crypto.Letter();
	letters=letters.AZ.concat(letters.az).concat(letters.ARletter);
	var temp="";
	for (var i = 0; i < txt.length; i++) {
		if(letters.indexOf(txt[i])!=-1)temp+=txt[i];
	}	
	return temp;
}






///////////////////// for GENETIC ALGORITHEM
last = function(a) {
	return(a[a.length-1]);
}

function pick(populations){
	var sum=0;
	populations.forEach(p=>sum+=p.fitness);
	var index=0;
	var r=random(1,0,1);
	while(r>0){
		r=r-populations[index].fitness/sum;
		index++;
	}
	index--;
	return populations[index];
}

phytarors=(a,b)=>{
	return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

class hashTable{
	constructor(){
		this.size=0;
		this.data=new Array(100).fill().map(e=>new Array());
		this.top=[0,0]
	}
	getIndex(key){		
		var index=1;
		for (var i = 0; i < key.length; i++) 
			index*=Math.sqrt(key.charCodeAt(i));
		index=index%this.data.length;
		return parseInt(index);
	}
	push(key,value){
		key=key.toString();
		if(!key)return false;
		this.value(key,value);
	}
	value(key,data=null){
		key=key.toString();
		var i=this.getIndex(key);
		for (var j = 0; j < this.data[i].length; j++) {
			if(data==null){
				if(this.data[i][j][0]==key)return this.data[i][j][1];
			}else{
				if(this.data[i][j][0]==key)return this.checkTop(this.data[i][j][1]=phytarors(data,this.data[i][j][1])/2,key);
			}
			this.data[i][j]
		}
		if(data!=null){this.size++;return this.data[i].push(new Array(key,this.checkTop(data,key)))}
		return false;
	}
	keys(){
		var temp=new Array();
		this.data.forEach(e=>{
			e.forEach(i=>{
				if(i.length>1)temp.push(i[0]);
			})
		})
		return temp;
	}
	checkTop(value,key){
		if(value>this.top[1])this.top=[key,value];
		return value;
	}
	empty(){
		this.size=0;
		this.data=new Array(100).fill().map(e=>new Array());
		this.top=[0,0]

	}
}




function random(big,less=0,float=0){ // return randomly number buttwin the number
	var Float=float?function(num){return parseFloat(num);}:function(num){return Math.floor(num);}
	var r;//the outcom
	//check the bigest number in big and the less 
	if(typeof(big)!=="object"&&big<less){
		var temp=less;less=big;big=temp;
	}
	var less_n=(less<0?(less||1):false);//for check if nember less is nigative
	var big_n=(big<0?(big||1):false);//for check if nember big is nigative
	// make it positive number
	big=typeof(big)!=="object"?Math.abs(big):big;
	less=Math.abs(less);
	// return random ellemnt from array
	if(!big){return false;}
	else if(typeof(big)=="object"){
		r=big[random(big.length)];
	}
	// return random number
	else if((!big_n&&!less_n)||(big_n&&less_n)){ ///big is not nigative and less is not nigative too [10,2] or the reverse 
		while(true){
			r=Float((Math.random()*(big+1))+less);
			if(r<=big&&r>=less)break;
		}
		if(big_n&&less_n){r*=-1;}
	}

	else if(big_n&&less==0){//big is nigative and less is null [-10]
		r=Float((Math.random()*(big+1)))*-1;
	}

	else if(!big_n&&less_n){ // big positive the less is nigative
		var p=random(big,undefined,float);   // make the part positive
		var n=random(less,undefined,float);  //make the part nigative
		r=random(1)?p:-n;    //toggle between the two by random
	}
	return r;
}

numberToHix=function(num){
	var letter =Crypto.Letter();
	letter=letter.AZ.concat(letter.az).concat(letter.ARletter);
	num=num.toString();
	var temp="";
	for (var i = 0; i < num.length; i+=2) {
		var current=parseInt(num.slice(i,i+2));
		if(current<letter.length-1&&num.slice(i,i+2).indexOf(".")==-1){
			temp +=letter[current];
		}else temp +=num.slice(i,i+2);
	}
	return temp;
}
hixToNumber=function(txt){
	var letter =Crypto.Letter();
	letter=letter.AZ.concat(letter.az).concat(letter.ARletter);
	txt=txt.split("");
	var temp="";
	for (var i = 0; i < txt.length; i++) {
		if(letter.indexOf(txt[i])!=-1)
			temp+=(letter.indexOf(txt[i])).toString()
		else temp+=txt[i];
	}
	return temp;
}
selectText=function(text,start, end) {
    var e = text;
    if (!e) return;
    else if (e.setSelectionRange) { e.focus(); e.setSelectionRange(start, end); } /* WebKit */ 
    else if (e.createTextRange) { var range = e.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
    else if (e.selectionStart) { e.selectionStart = start; e.selectionEnd = end; }
};
