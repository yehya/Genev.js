/* global, GF */

/////////////////////////////////////
//// 	Finding a String
/////////////////////////////////////

/*
 * Here we will be using Genev to find the string contained in ourString"
 * The code here is just a variation of the helloWorld.js code
 */

var ourString = 'Some string...';

// Our CHROMO_STRUCTURE
var chromosome = { // holds weights from 0 to 1
  genes: {}
};

// We'll give it a gene for each letter in the string
for (var i = 0; i < ourString.length; i += 1) {
  var geneCode = 'gene' + i; // some unique gene key
  chromosome.genes[geneCode] = 0; // set it to some val
}

/** Our fitness function
 * Returns a score for the chromosome
 * Needs to calculate how fit the chromosome is,
 * The higher the score, the more fit the chromosome.
 */
var fitfunc = function(genes) {
  // every character matched will increment the score by 1
  var property, score = 0, i = 0;
  // lucky for us this loops the same order we initalized chromosome (and genes is the same), so: gene1, gene2.. and so on
  for (property in genes) {
    var geneChar = String.fromCharCode(Math.floor(genes[property] * 255)); // This is the char we get from the weight
    if (ourString.charAt(i) === geneChar) {
      score += 1;
    }
    i += 1; // the property corresponds with the character in ith position
  }
  return score; // 0 to ourString.length, each correct char is 1 point
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
    console.log('#' + i + ' ' + string);
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
  maxPopulation: 251,
  numToSelect: 37,
  exitScore: ourString.length, // The highest score possible is the length of our string
  onNewGen: onNewGen
};

/** Our genev object initialized with our CHROMO_STRUCTURE */
var findString = genev(chromosome, options);

/* Init it with your own population or it will generate random ones */
findString.initPopulation(); // generates random population

// Population before evolving
printReadable(findString.getPopulation());

findString.evolve(fitfunc, options); // you can also pass in the options here again.

// Population after evolving
printReadable(findString.getPopulation());
/* Some extra notes

*/
