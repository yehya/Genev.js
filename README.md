[![npm version](https://badge.fury.io/js/genev.svg)](https://badge.fury.io/js/genev)

# Genev.js
Genetic Evolution Algorithm framework

##What is Genev?
Genev is a framework that lets you easily use the genetic algorithm search heuristic to find solutions to optimization or search problems.

Todo:
* Add method chaining
* Add tests
* Add Travis
* npm-ify
  
##In a nutshell
```javascript
// Create a chromosome
var chromosome = {
  gene1: null,
  gene2: null 
};

// Create a fitness function
var ff = function (genes) {
  var gene, score = 0;
  for (gene in genes) { score += gene; } // score will be a sum of the genes
  return score;
}

// Use Genev
var genev = GF(chromosome); // set it up with our chromosmoe
genev.initPopulation(); // initialize it
genev.evolve(ff); // let it rip!
```
