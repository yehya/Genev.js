/* global, GF */

/**
 * Conceptual sample of how to use Genev
 */

/**
 * First we create our chromosome that will be used as
 * the structure for chromosomes Genev will work with. 
 */
// Sample GENE_STRUCTURE
var chromosome = { // all of these will hold double values from 0 to 1
  genes: {
    weight1: 0,
    weight2: 0,
    weight3: 0,
    weight4: 0,
    weight5: 0
  }
};

/**
 * Then we create a fitness function that will be used to evaluate
 * the fitness of each chromosome.
 * 
 * In this case we will get the sum of the genes, therefore our ideal chromosome
 * should be the one with the largest genes.
 */
// Sample fitness function
var fitfunc = function(genes) { // must take genes
  var score = 0;
  var gene;
  for (gene in genes) {
      score += gene;
  }
  return score;
};

/**
 * This is where we create a new Genev instance.
 * First we will initialize it with the chromosome we created earlier.
 */
// Initializing the new Genetic Framework
var myGF = genev(chromosome);

/**
 * Then we will use Genev's provided method initPopulation() which
 * will generate a random set of chromosomes 
 */
myGF.initPopulation();

/**
 * And finally we start to evolve toward the solution
 */
myGF.evolve(fitfunc);
