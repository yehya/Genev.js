/* global, GF */

/////////////////////////////////////
//// Finding Hello, World!
/////////////////////////////////////

/*
 * Here we will be using Genev to find the string "Hello, World!"
 */

var helloWorld = 'Hello, World!';

// Our CHROMO_STRUCTURE
var chromosome = { // holds weights from 0 to 1
  genes: {
    h: 0,
    e: 0,
    l: 0,
    l2: 0,
    o: 0,
    comma: 0,
    sp1: 0,
    w: 0,
    o2: 0,
    r: 0,
    l3: 0,
    d: 0,
    exlam: 0
  }
};

/** Our fitness function
 * Returns a score for the chromosome
 * Needs to calculate how fit the chromosome is,
 * The higher the score, the more fit the chromosome.
 */
var fitfunc = function(genes) {
  // every character matched will increment the score by 1
  var property, score = 0, i = 0;
  // lucky for us this loops the same order we initalized chromosome (and genes is the same), so: h, e, l, l2.. and so on
  for (property in genes) {
    var geneChar = String.fromCharCode(Math.floor(genes[property] * 255)); // This is the char we get from the weight
    if (helloWorld.charAt(i) === geneChar) {
      score += 1;
    }
    i += 1; // the property corresponds with the character in ith position
  }
  return score; // 0 - 13, each correct char is 1 point
};

var printReadable = function(population) {
  console.log('Generation #' + population[0].generation);
  for (var i = 0; i < 1; i += 1) {
    var string = '';
    var property;
    for (property in population[i].genes) {
      var geneChar = String.fromCharCode(Math.floor(population[i].genes[property] * 255));
      string += geneChar;
    }
    console.log('Generation #' + population[0].generation+" "+string);
  }
};

var onNewGen = function(pop) {
  printReadable(pop);
};

/** Some option changes (defaults are lame)
 * Increased generations and mutation probability
 */
var options = {
  maxGenerations: 1000,
  mutationProb: 0.1382005272898823, // 13% mutation
  maxPopulation: 251, // The Max population
  numToSelect: 37,
  exitScore: 13, // since the max score for "Hello, World!" is 13
  onNewGen: onNewGen
};

/** Our genev object initialized with our CHROMO_STRUCTURE */
var findHelloWorld = GF(chromosome, options);

/* Init it with your own population or it will generate random ones */
findHelloWorld.initPopulation(); // generates random population

// Population before evolving
printReadable(findHelloWorld.getPopulation());

// Start evolving
findHelloWorld.evolve(fitfunc);

// Population after evolving
printReadable(findHelloWorld.getPopulation());
/* Some extra notes

*/