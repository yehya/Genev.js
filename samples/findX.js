/* global, GF */

/////////////////////////////////////
//// Finding numbers that sum to X
/////////////////////////////////////

var genev = require('genev');

/*
 * Here we will be using Genev to find combinations
 * of two numbers that have a sum of a number X.
 * Where X is between 0 and 100
 */

var X = 50;

// Our CHROMO_STRUCTURE
var chromosome = { // holds weights from 0 to 1
  genes: {
    number1: 0, // weight of first number to be added
    number2: 0 // weight of second number to be added
  }
};

/** Our fitness function
 * Returns a score for the chromosome
 * Needs to calculate how fit the chromosome is,
 * The higher the score, the more fit the chromosome.
 */
var fitfunc = function(genes) {
  var num1 = 100 * genes.number1; // get number from 0 - 100
  var num2 = 100 * genes.number2; // get number from 0 - 100
  var sum = Math.round(num1 + num2);
  var distanceFromX = Math.abs(X - sum);
  // max possible distance is 150, so we subtract that here
  // the max distance will result in a score of 0
  // So the max score will result in the max distance
  // Here 200 is the maximum sum of the two numbers
  return 200 - X - distanceFromX;
};

var onNewGen = function(pop) {
  console.log('Generation #' + pop[0].generation);
  console.log('Number1: ' + pop[0].genes.number1 * 100);
  console.log('Number2: ' + pop[0].genes.number2 * 100);
  console.log('Score: ' + pop[0].score);
};

/** Some option changes (defaults are lame)
 * Increased generations and mutation probability
 */
var options = {
  maxGenerations: 1000,
  mutationProb: 0.10,
  onNewGen: onNewGen,
  exitScore: 150
};

/** Our genev object initialized with our CHROMO_STRUCTURE */
var find50 = genev(chromosome);

/* Init it with your own population or it will generate random ones */
find50.initPopulation(); // generates random population
find50.evolve(fitfunc, options);
/* Some extra notes

Mutation:
The default mutation method used in genev is
generating completely new random weights from 0 to 1
for individual genes. This is not ideal for this kind of problem.
Ideally if we have a mutating weight that is 0.5, the change (absolute(before-after))
should be inversely proportional to the probability that it occurs.
In other words, there should be a large probability
for small mutations, and low probability for large mutations.
So it is more likely that a 0.5 would become a 0.6 after mutation, than a 0.5 becoming a 1.

Also in this case limiting mutation range (a.k.a. maximum change of 0.2 etc.) would not be much of an issue, however,
in other complicated problems, mutations should usually never be limited to avoid getting solutions
that are local optimums (look this up, it's pretty important in GA).

*/