class DNA{
	constructor(genes){
		this.genes=genes||new Array(25).fill().map(()=>random(1,0,1));
		this.fitness=0.0000000001;
		this.neighbor=new hashTable;
	}
	calcFitness(target){
		var somGuess=1;
		for(var k of this.neighbor.keys())
			somGuess+=this.neighbor.value(k);
		if(this.neighbor.value(target)){
			this.fitness=this.neighbor.value(target)/somGuess;
		}
	}

	crossover(dna){
		let child=new DNA;
		var center=random(parseInt(this.genes.length/2-5),parseInt(this.genes.length/2+5))
		for (var i = 0; i < this.genes.length; i++)
			child.genes[i]=center>i?dna.genes[i]:this.genes[i];
		return child;
	}

	mutation(rate){
		for (var i = 0; i < this.genes.length; i++){
			if(random(1,0,1)<rate)
				this.genes[i]=random(1,0,1);
		}
	}
}


class Population{

	constructor(maxpop,mRate,preDATA=null){
		this.maxpop=maxpop
		this.mutationRate=mRate;

		if(preDATA.length){
			preDATA=hixToNumber(preDATA);
			preDATA=preDATA.replace(/[\.]/gm,"0");
			var temp=new Array();
			for (var i = 0; i < preDATA.length; i+=3) {
				temp.push(parseFloat("0."+preDATA.slice(i,i+3)));
			}
		}
		var i=-25;
		this.population=new Array(this.maxpop).fill().map(()=>{
			i+=25;
			return new DNA(preDATA.length?temp.slice(i,i+25):null)
		});
	}
	action(strings){


		strings=strings.map(e=>e.map(s=>getCurrectWord(s.trim())).filter(es=>es.length>3)).filter(e=>e.length);
		let determin=new hashTable();
		determin.push(last(last(strings)),0);
		


		for(let g=0;g<this.population[0].genes.length;g++){
			let temp=determin.keys();
			determin.empty();
			for (let i = 0; i < strings.length; i++){
				let strs=strings[i];
				if(!strs.length)continue;
				for(let s =0;s<strs.length;s++){
					let str=strs[s];
					if(temp.indexOf(str)!=-1){
						this.population.map(dna=>{
							if(s>0){
								dna.neighbor.push(strs[s-1],dna.genes[g]);
								determin.push(strs[s-1],0);
							}
							if(s+1<strs.length){
								dna.neighbor.push(strs[s+1],dna.genes[g]);
								determin.push(strs[s+1],0);
							}
						})	
					}
				}
			}
			for (let i = 0; i < strings.length; i++){
				temp.forEach(d=>{
					if(strings[i].indexOf(d)!=-1)
						strings[i].splice(strings[i].indexOf(d),1)
				})
			}
		}
		var top=[null,0];
		this.population.forEach(dna=>top=dna.neighbor.top[1]>top[1]?dna.neighbor.top:top);

		return {guess:top[0],confd:top[1]};
	}
	calcFitness(target){
		this.population.forEach(dna=>{
			dna.calcFitness(target);
		});

	}
	selection(){
		let tempPopulation=new Array();
		for (var i = 0; i < this.population.length; i++) {
			let parentA=pick(this.population);
			let parentB=pick(this.population);
			if(parentA===parentB){i--;continue;}
			let child=parentA.crossover(parentB);
			child.mutation(this.mutationRate);
			tempPopulation.push(child);
		}
		this.population=tempPopulation;
		this.generations++;

	}

	save(){
		var data="";
		this.population.forEach(dna=>{
			dna.genes.forEach(gene=>{
				data+=(gene).toString().slice(2,5).replace(/[0]/gm,".");
			})
		})
		return numberToHix(data);
	}


}
