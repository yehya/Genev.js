/* global, GF */

/** 
 * Conceptual sample of how to use Genev
 */

// Sample GENE_STRUCTURE
var chromosome = { // all of these will hold double values from 0 to 1
	weight1: 0,
	weight2: 0,
	weight3: 0,
	weight4: 0,
	weight5: 0
};

// Sample fitness function
var fitfunc = function (chromo) { // must take a chromosome
	var score = Math.random();
	return score;
};

// Initializing the new Genetic Framework
var myGF = GF(chromosome);

myGF.initPopulation();
myGF.evolve(fitfunc);
