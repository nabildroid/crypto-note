class Crypto{
	constructor(){
		this.letter= Crypto.Letter();
		this.letterLength=0;
		this.codeList;
		for(var e in this.letter)
			this.letterLength+=this.letter[e].length;
	}
	static Letter(){return {		
			AZ:["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K","X", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "Y", "Z"],
			az:["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k","x", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "y", "z"],
			ARletter:["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د", "ط", "ك", "م", "ن", "ت", "ا", "ل", "ب", "ي", "س", "ش", "ئ", "ء", "ؤ", "ر", "ﻻ", "ى", "ة", "و", "ز", "ظ", "ذ"],
			number:["0","1","2","3","4","5","6","7","8","9"],
			symbol1:[ "é"," ", "#", "'", "{", "(", "[", "-", "è", "`", "_", "ç",  "à", ")", "]", "=", "}", "*", "+", ",", ";", ":", "!", "/", ".", "?", "$", "£", "%",  "æ"],
			symbol:["↵","^","~", "|","§", "ù", "¶", "ŧ", "ø", "þ", "@", "ß", "ð", "đ", "ŋ", "ħ", "ł", "µ", "»", "¢"]
		}
	};
	setCodeList(name,pass){
		this.codeList=this.encriptList(name,pass);
	}
	encriptList(name,pass){
		//calc the addition from name and password using the order of letter 		
		let cFX=(a,b,c)=>{
			b=a/(1+Math.exp(-b));
			return Math.abs(Math.sin(100*b/a)/(1+Math.exp(-Math.sqrt(Math.pow(a,b*Math.sin(a*1000))))));
		};
		var temp=1,PaddU=1;
		for (var i = 0; i < 2; i++) {
			var current=[name,pass][i]
			var cl=current.length;
			for (var j = 0; j < current.length; j++) {
				var exist=0;
				for(var e in this.letter){
					exist=cFX(this.letter[e].indexOf(current[j])+1,
							  current[j].charCodeAt(0)*(
							  j<cl-2?cFX(current[j+1].charCodeAt(0),j+i+1):1)
						,1);
					if(exist)break;
				}
				temp=Math.sqrt(Math.pow(temp,2)+Math.pow(exist,2));
			}	
			PaddU*=temp/current.length||1;
			temp=0;
		}
		PaddU=cFX(Math.sqrt(Math.pow((PaddU*1000),1/PaddU)),Math.cos(100*PaddU));
		PaddU*=hash(name+pass+PaddU.toString());

		// clac asci code of password
		temp="";
		for(var i=0;i<pass.length;i++)
			temp+=pass[i].charCodeAt(0).toString()
		var asciPass=Math.log(temp)/Math.log(2)/temp.length;
		var letter=[];
		for(var e in this.letter)
			letter=letter.concat(this.letter[e]);

		//  formeliar fx
		var fx=(letter)=>{
			return  parseInt(asciPass*(letter.charCodeAt(0)*PaddU))%this.letterLength;
		};
		//convert every letter in letter array to encrypt code
		var code=[];

		for (var i = 0; i < letter.length; i++) {
			var m=letter[i];
			var mCode=fx(m.toString())//convert letter to code using fx function
			while(code.map(e=>(e[1]==mCode)?code.indexOf(e)+1:0).filter(e=>e).length)
				mCode=(mCode+1)%(letter.length);
			code.push([m,mCode]);
		}
		return code;
	}
	crypt(message,name,pass){
		let code=this.codeList?Array.from(this.codeList,x=>[...x]):this.encriptList(name,pass);
		var msg=""// the enctypt message
		message=message.split(""); //the origin;
		var letter=[];
		for(var e in this.letter)
			letter=letter.concat(this.letter[e]);
		for(var i=0;i<message.length;i++){

			if(message[i].charCodeAt(0)==10)message[i]="↵";
			msg+=letter[code[code.map(e=>(e[0].toString()==message[i])?code.indexOf(e)+1:0).filter(e=>e)[0]-1][1]]

			let inc=code[i%code.length][1]*Math.cos(i+1)-code[code[(i+10)%code.length][1]*code[Math.abs(i-10)%code.length][1]%code.length][1];//incriment
			inc=Math.abs(Math.round(inc));
			code=code.map(c=>{
				c[1]=(c[1]+inc)%code.length;
				return c;
			})			

		}
		return msg;

	}
	decrypt(message,name,pass){
		let code=this.codeList?Array.from(this.codeList,x=>[...x]):this.encriptList(name,pass);
		var msg=""// the enctypt message

		message=message.split(""); //the origin;
		var letter=[];
		for(var e in this.letter)
			letter=letter.concat(this.letter[e]);
		for(var i=0;i<message.length;i++){			
			try{
				var l=(code[code.map(e=>(letter[e[1]].toString()==message[i])?code.indexOf(e)+1:0).filter(e=>e)[0]-1][0]);
			}catch(e){}
			if(l=="↵"||l.charCodeAt(0)==8629)l="\n";
			msg+=l;
			let inc=code[i%code.length][1]*Math.cos(i+1)-code[code[(i+10)%code.length][1]*code[Math.abs(i-10)%code.length][1]%code.length][1];//incriment
			inc=Math.abs(Math.round(inc));
			code=code.map(c=>{
				c[1]=(c[1]+inc)%code.length;
				return c;
			})
		}
		return msg;
	}
}

function hash_position(name,size){
	var temp=0;
	for(var i=0;i<name.length;i++)
		temp+=Math.floor(name[i].charCodeAt(0),i);
	return temp%parseInt(size+1);
}


function hash(txt){//Nabil
	if(txt.length>=1000&&typeof(txt)==="string"){
		txt=[txt.slice(0,1000),txt.slice(1000,txt.length)];
		for (var i = 0; i < txt.length; i++) {
			if(txt[i].length>1000){
				txt.push(txt[i].slice(1000,txt[i].length))
				txt[i]=txt[i].slice(0,1000).replace(/\n/gm,"↵");
			}
		}
		return hash(txt);
	}else if(txt.length<1000&&typeof(txt)==="string"){
		txt=txt.replace(/\n/gm,"↵");
		txt=txt+txt;
		return hash(txt);
	}
	while(txt[0].length>=30){
		txt=txt.map(text=>{
			var part=[];
			//slice the text to part
			for (var i = 0; i < text.length; i+=20)
				part.push(text.slice(i,i+20));
			//convert each part to asci code
			part=part.map(p=>{
				var temp=part.indexOf(p)+1;
				for (var i = 0; i < p.length; i++) 
					temp+=parseInt(p[i].charCodeAt(0))*(i+1)
				return parseInt(temp);
			})
			//add each part to all other parts
			part=part.map(e=>{
				for (var i = 0; i < part.length; i++) {
					if(part[i]==e)return e;
					else return e+part[i];
				}
			})
			part=part.map(e=>e.toString())
			return part.join("");
	 });
	}
	var r=0;// revert toggel
	var total=0;
	var tempT=0;
	var t;
	txt.forEach(t=>{
		if(r){
			t=parseInt(t.split("").reverse().join(""));
			tempT=t;
			t*=Math.pow(10,Math.abs(t.toString().length-total.toString().length));
		}
		total+=parseInt(t);
		r=!r;
	});
	return Math.abs((total%Math.pow(10,15))-tempT);
}
