# Genev.js
Genetic Evolution Algorithm framework

##What is Genev?
Genev is a framework that lets you easily use the genetic algorithm search heuristic to find solutions to optimization or search problems.

Todo:
* Add tests
* Node.js-ify
* CONTRIBUTING.md - Really want this to be open source
  
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
  for (gene in genes) { score += gene; }
  return score;
}

// Use Genev
var genev = GF(chromosome);
genev.initPopulation();
genev.evolve(ff);
```
