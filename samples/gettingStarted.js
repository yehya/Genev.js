/* global, genev */

/**
 * Getting started with Genev.js
 */

var genev = require('genev');

/**
 * Step 1
 * Create a chromosome structure
 */

var chromosome = {
    genes: {
        gene1: null,
        gene2: null,
        gene3: null,
        geneN: null
    }
};

/** The following is also equivalent/acceptable */

var genes = {
    gene1: null,
    gene2: null,
    gene3: null,
    geneN: null
};

/** 
 * Step 2
 * Create a fitness function.
 * 
 * This function must accept a genes object as its first argument
 * where then you must define an algorithm to evaluate the fitness of those genes
 */

var fitnessFunction = function (genes) {
    var score = someCalculatedScore;
    // Do something with genes.gene1 and gene2 etc.
    return score; // a number that can be in any range
}

/**
 * Step 3
 * Initialize a new Genev instance.
 */

var gen = new genev(chromosome);

/**
 * Step 3.
 * Initialize population.
 */
gen.initPopulation();

/**
 * Step 4.
 * Evolve.
 */
myGF.evolve(fitfunc);

/*
 * This is not a functioning sample,
 * it is only for understanding how the most 
 * basic strucuture would look like.
 * 
 * Check helloWorld.js for a working sample.
 */