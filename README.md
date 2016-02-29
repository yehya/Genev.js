[![npm version](https://badge.fury.io/js/genev.svg)](https://badge.fury.io/js/genev)

# Genev.js
Genetic Evolution Algorithm framework

##What is Genev?
Genev is a framework that lets you easily use the genetic algorithm search heuristic to find solutions to optimization or search problems.

##Installation

```
$ npm install genev
```
  
##How to use Genev in a nutshell
```javascript

var genev = require('genev');

// Create a chromosome
var chromosome = {
  gene1: null,
  gene2: null 
};

// Create a fitness function
var ff = function (genes) {
  var score = 0;
  
  // In this example,
  // the score will be the sum of the genes
  // so the fittest chromosome shall be the one with the largest genes 
  score = genes.gene1 + genes.gene2;
  
  // the score can be any number (there is no restriction on it's range)
  // as long as the score is proportional to the fitness
  return score;
}

// Use Genev
var myga = genev(chromosome); // set it up with our chromosmoe
myga.initPopulation(); // initialize it
myga.evolve(ff); // let it rip!
```

## Examples of projects using Genetic Algorithms

[Artifical Intelligence playing Tetris] (https://codemyroad.wordpress.com/2013/04/14/tetris-ai-the-near-perfect-player/)
