
#Getting started with Genev.js
 
```javascript
var genev = require('genev');
```javascript

###Step 1: Create a chromosome structure

```javascript
var chromosome = {
    genes: {
        gene1: null,
        gene2: null,
        gene3: null,
        geneN: null
    }
};
```javascript

The following is also equivalent/acceptable

```javascript
var genes = {
    gene1: null,
    gene2: null,
    gene3: null,
    geneN: null
};
```javascript
 
###Step 2: Create a fitness function
  
This function must accept a genes object as its first argument
where then you must define an algorithm to evaluate the fitness of those genes
 
```javascript
var fitnessFunction = function (genes) {
    var score = someCalculatedScore;
    // Do something with genes.gene1 and gene2 etc.
    return score; // a number that can be in any range
}
```javascript

###Step 3: Initialize a new Genev instance.
 
```javascript
var gen = new genev(chromosome);
```javascript

###Step 3: Initialize population
 
 ```javascript
gen.initPopulation();
```javascript

###Step 4: Evolve
 
 ```javascript
myGF.evolve(fitfunc);
```javascript

This is not a functioning sample,
it is only for understanding how the most 
basic strucuture would look like.

Check helloWorld.js for a working sample.
 