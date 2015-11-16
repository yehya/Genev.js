// Sample GENE_STRUCTURE
var chromosomeStructre = {
	weight1: 0,
	weight2: 0,
	weight3: 0,
	weight4: 0,
	weight5: 0
};

// Sample fitness function
var myFitnessFunction = function (chromosome) {
	var score;
	return score;
};

// Initializing the new Genetic Framework
var myGF = new GF(chromosomeStructre);

myGF.initPopulation();
myGF.evolve(myFitnessFunction);
