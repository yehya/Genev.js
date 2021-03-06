/*global  jQuery, i, j, ii*/

'use strict';

(function() {
  var root = this;

  // save previous data for 'genev'
  var prevGenev = root.genev;

  var genev = function(CHROMO_STRUCTURE, options) {

    // Makes me gag, but this'll be my solution for now
    var clone = function(obj) {
      return JSON.parse(JSON.stringify(obj));
    };

    // Create our own extend function
    var extend = function() {
      var objct, property, src, ncopy,
      original = arguments[0] || {},
      i = 1,
      length = arguments.length;
      if (typeof original !== 'object') {
        original = {};
      }
      if (i === length) {
        return original;
      }
      for (; i < length; i++) {
        if ((objct = arguments[i]) != null) {
          for (property in objct) {
            src = original[property];
            ncopy = objct[property];
            if (original === ncopy) {
              continue;
            }
            if (ncopy !== undefined) {
              original[property] = ncopy;
            }
          }
        }
      }
      return original;
    };

    /* PRE-CONDITIONS */

    // Check for invalid parameter CHROMO_STRUCTURE
    if ((typeof CHROMO_STRUCTURE === 'undefined') || (typeof CHROMO_STRUCTURE !== 'object') ||
        CHROMO_STRUCTURE === null) {
      return null;
    }

    // Accept both genes object or chromo->genes object
    if ((typeof CHROMO_STRUCTURE.genes === 'undefined')) {
      var genes = clone(CHROMO_STRUCTURE);
      CHROMO_STRUCTURE = {genes: genes};
    }

    // Must have at least 1 gene
    if (Object.keys(CHROMO_STRUCTURE.genes).length < 1) {
      return null;
    }

    ///////////////////////////////////////////////////////////
    //      START OF PRIVATE CLASS METHODS/PROPERTIES
    ///////////////////////////////////////////////////////////

    /** Object that represents all of the class private methods and properties. */
    var gfprivate = {};

    /** Chromosome structure */
    gfprivate.CHROMO_STRUCTURE = CHROMO_STRUCTURE;

    /** Default options */
    gfprivate.DEFAULT_OPTIONS = {
      maxPopulation: 45,
      maxGenerations: 1000,
      mutationProb: 0.05,
      numToSelect: 10,
      elitism: true,
      exitScore: -1 // -1 always runs until maxGenerations is reached
    };

    /** Maximum population size */
    gfprivate.maxPopulation = 45; // default to 45

    /** Maximum number of generations */
    gfprivate.maxGenerations = 100; // default to 100

    /** Mutation probability */
    gfprivate.mutationProb = 0.05; // default to 5%

    /** Selection number (a.k.a. tournament winners) */
    gfprivate.numToSelect = 10; // default to 10 tributes (they volunteer)

    /** If true, ensures that the top chromosome always survives to next generation */
    gfprivate.elitism = true; // default to true

    /** Holds the elite chromosome */
    gfprivate.elite = {};

    /** Chromosome atrributes */
    gfprivate.chromosome = {
      genes: {},
      score: 0,
      generation: 0
    };

    /** Generation Population Array */
    gfprivate.population = [];

    /** Sort (descending) chromosomes based on score */
    gfprivate.sortPopulation = function() {
      gfprivate.population.sort(function(a, b) {
        return b.score - a.score; // descending score order
      });
    };

    /** Crossover Xgene and Ygene and return crossover */
    gfprivate.crossover = function(Xchromo, Ychromo) {
      var crossedChromo = extend({},gfprivate.chromosome), // create new chromosome
          property; // holds the looped property
      for (property in Xchromo.genes) { // loop through all weights
        if (Xchromo.genes.hasOwnProperty(property)) {
          // 50/50 chance of picking a gene from either
          crossedChromo.genes[property] = ((Math.random() > 0.5) ? Xchromo.genes[property] : Ychromo.genes[property]);
        }
      }
      // increase generation
      crossedChromo.generation = Xchromo.generation + 1;
      return extend({},crossedChromo);
    };

    /** Mutate individual chromosomes */
    gfprivate.getMutated = function(chromo) {
      var mutatedChromo = extend({},chromo),
          property;
      for (property in chromo.genes) {
        if (chromo.genes.hasOwnProperty(property)) {
          mutatedChromo.genes[property] = ((Math.random() < gfprivate.mutationProb) ? Math.random() : chromo.genes[property]);
        }
      }
      return mutatedChromo;
    };

    /** Generates a new random chromosome using the structure provided */
    gfprivate.newChromosome = function() {
      var newChromosome = extend({},gfprivate.chromosome),
          property;
      newChromosome.genes = gfprivate.CHROMO_STRUCTURE.genes;
      for (property in newChromosome.genes) {
        if (newChromosome.genes.hasOwnProperty(property)) {
          newChromosome.genes[property] = Math.random();
        }
      }
      return newChromosome;
    };

    /** Default fitness function (should be replaced with custom function by framework user) */
    gfprivate.fitnessFunction = function(genes) {
      var property;
      for (property in genes) {
        if (genes.hasOwnProperty(property)) {
          return genes[property];
        }
      }
    };

    /** Evaluate scores of all chromosomes and sets their score property */
    gfprivate.evaluate = function() {
      for (var i = 0; i < gfprivate.population.length; i += 1) {
        var score = {score: gfprivate.fitnessFunction(gfprivate.population[i].genes)};
        extend(gfprivate.population[i],score);
      }
      gfprivate.sortPopulation();
    };

    /** Selects the most fit numToSelect in the population */
    gfprivate.selectFittest = function() {
      if (gfprivate.numToSelect > 0) {
        gfprivate.population.splice(gfprivate.numToSelect);
      } else {
        gfprivate.population.splice(1); // If numToSelect is 0 for somereason, we select 1
      }
      // Clone the elite and save it
      gfprivate.elite = clone(gfprivate.population[0]);
      gfprivate.elite.generation += 1;
    };

    /** Selects random chromosomes in a given population,
     * and then pushes those selected to the main population (which is emptied before hand)
     * @param selectionPop a population to select from */
    gfprivate.selectRandom = function(selectionPop) {
      // The number of chromosomes to randomly select should be the least of the two
      var numToSelect = selectionPop.length < gfprivate.maxPopulation ? selectionPop.length : gfprivate.maxPopulation;
      gfprivate.population = [];
      // TODO Avoid re-adding the same randomly selected chromosome
      for (var i = 0; i < numToSelect; i += 1) {
        var selector = Math.floor(Math.random() * selectionPop.length); // Random number from 0 to selectionPop.length
        gfprivate.population.push(clone(extend({},selectionPop[selector]))); // add the selected value to the population, TODO Hack solution, replace
      }
      // We then fill the rest of it with random chromosomes,
      var restNum = gfprivate.maxPopulation - selectionPop.length;
      for (var i = 0; i < restNum; i += 1) {
        gfprivate.population.push(clone(gfprivate.newChromosome()));
      }
    };

    /** The method to be used when extending gfprivate with any options,
     * It just checks for any invalid option values that essentially break everything, and fallsback to
     * some safe (probably default values, or not)
     * etc. */
    gfprivate.extend = function(options) {
      extend(gfprivate, options); // first we set whatever we were given
      // Then we check, and fix them if need be
      if (gfprivate.maxPopulation < 10) {
        gfprivate.maxPopulation = 10;
      } else if (gfprivate.numToSelect < 1) {
        gfprivate.numToSelect = 1;
      }
    };

    /** Crossover the entire population in gfprivate.population
   * This method has the efficiency class of O(n^2) but is usually run on the fittest
   * chromosomes selected (which are only 10 by default). Keep this in mind when changing the
   * default ```numToSelect``` option.
   */
    gfprivate.crossPopulation = function() {
      var crossoverPopulation = [];
      // Crosses all n chromosomes with all other n-1 chromosomes
      for (var i = 0; i < gfprivate.population.length; i += 1) {
        for (var ii = 1; ii < gfprivate.population.length - i; ii += 1) {
          // 50/50 chance for selecting genes
          var crossoverChromosome = extend({},gfprivate.crossover(gfprivate.population[i], gfprivate.population[ii]));
          crossoverPopulation.push(clone(crossoverChromosome)); // HACK SOLUTION FOR REFERENCE PROBLEM, TODO REPLACE THIS
        }
        gfprivate.population[i].generation += 1; // increase the generation
        crossoverPopulation.push(clone(gfprivate.population[i])); // Re-add all chromosomes used in crossing
      }
      gfprivate.selectRandom(crossoverPopulation); // randomly select chromosomes in the crossoverPopulation and place them in the population
    };

    /** Mutates the entire population */
    gfprivate.mutatePopulation = function() {
      for (var i = 0; i < gfprivate.population.length; i += 1) {
        gfprivate.population[i] = clone(gfprivate.getMutated(gfprivate.population[i])); // HACK, TODO FIX
      }
    };

    /** Initializes the population array with a random set of chromosomes. */
    gfprivate.initRandomPop = function() {
      /* CREATE RANDOM POPULATION */
      for (var i = 0; i < gfprivate.maxPopulation; i += 1) {
        // Create new random chromosome
        var newChromosome = extend(true, {}, gfprivate.newChromosome());
        // Add it to the population
        gfprivate.population.push(newChromosome);
      }
    };

    /** Checks if the exit score has been reached
     * @returns boolean */
    gfprivate.exitScoreReached = function() {
      if (gfprivate.exitScore !== -1) {
        if (gfprivate.population[0].score >= gfprivate.exitScore) {
          return true;
        }
      }
      return false;
    };

    /** Runs at the beginning of every generation loop. A.k.a. when the generation is born (and evaluated).
     * This should be changed to fit the special needs of every user.
     * If you want to print/log/view the data after every generation, you would do it here.
     * @param population Array containing all chromosomes in the population
     */
    gfprivate.onNewGen = function(population) {
      // default does nothing
      return;
    };

    ///////////////////////////////////////////////////////////
    //             START OF PUBLIC METHODS/API
    ///////////////////////////////////////////////////////////

    /** Class public methods/properties */
    var gfpublic = {};

    /** Initializes the population with either user provided chromosomes or randomly generates them
     * @param initpop (optional) User provided array of initial chromosomes
     * @param validate (optional) Set true if you want genev to validate your array. It is optional as it could be an expensive process.
     * @returns boolean If you provided ```validate``` as true, it will return false when initialization has failed because of invalid data.
     */
    gfpublic.initPopulation = function(initpop, validate) {
      if (typeof initpop !== 'undefined') {
        if (typeof validate !== 'undefined' && validate === true) {
          // validate that all objects in input initpop contain correct properties (CHROMO_STRUCTURE)
          for (var i = 0; i < initpop; i += 1) {
            var property;
            if (typeof initpop[i].genes === 'undefined') {
              // chromosomes not built properly, they need to have a genes properties
              // TODO need some kind of error handler
              return;
            }
            for (property in gfprivate.CHROMO_STRUCTURE) {
              if (typeof initpop[i].genes[property] === 'undefined') {
                // Missing property discovered one of initpop's chromosomes
                return;
              }
            }
          }
        }
        /* Initialize with provided population */
        gfprivate.population = [];
        gfprivate.population.push(initpop);
      }
      /* Init random if one is not provided */
      gfprivate.initRandomPop();
    };

    /** Evolves the population
   * @param evolveOptions object that accepts options (optional)
   * @param fitfunc a fitness function (optional)
   * @returns void
   */
    gfpublic.evolve = function(fitfunc, evolveOptions) {
      // Update options again.
      gfprivate.extend(evolveOptions);

      // The generation counter
      var generationCount = gfprivate.maxGenerations;

      // Set the fitness function if it was passed in
      if (typeof fitfunc === 'function') {
        gfprivate.fitnessFunction = fitfunc;
      }

      // Abort
      // If the population is not initialized
      if (gfprivate.population.length == 0) {
        // console.error("No population initialized. Hint: Use .initPopulation before .evolve");
        return;
      }

      // Loops for each generation
      while (generationCount--) {
        /* START EVOLUTION */

        /* EVALUATION PHASE */

        gfprivate.evaluate(); // Test all chromosomes and score them

        /* AFTER EVALUATION CALLBACK */

        if (typeof gfprivate.onNewGen === 'function') {
          gfprivate.onNewGen(gfprivate.population); // run default, or custom function if specified in the options
        }

        /* SELECTION PHASE */

        gfprivate.selectFittest(); // Select most fit chromosomes in terms of score attribute

        /* BREAK CONDITION/SCORE CHECK */

        if (gfprivate.exitScoreReached()) {
          break;
        }

        /* CROSSOVER PHASE */

        gfprivate.crossPopulation();

        /* MUTATION PHASE */

        gfprivate.mutatePopulation();

        /* ELITISM PHASE */

        gfprivate.population.push(gfprivate.elite);

        /* REPEAT UNTIL LAST GENERATION */
      }

      /* END EVOLUTION */
      gfprivate.evaluate();
      gfprivate.selectFittest();
    };

    /** Resets all options to the defaults */
    gfpublic.resetOptions = function() {
      gfprivate.extend(gfprivate.DEFAULT_OPTIONS);
    };

    /** Returns the population currently in gfprivate.population
   * @returns array Array of chromosomes
   */
    gfpublic.getPopulation = function() {
      return gfprivate.population;
    };

    ///////////////////////////////////////////////////////////
    //                INIT SETUP
    ///////////////////////////////////////////////////////////

    /** Setting default options */
    gfpublic.resetOptions();

    /* Options merging
    This also adds extra flexibility to users who want more control over
    genev as it also allows them to replace private methods/properties. (so they're not completely private...)
    TODO Decide if we want to keep it this way */
    gfprivate.extend(options);

    // Return class public methods (a.k.a. make them available for use)
    return gfpublic;
  };

  genev.noConflict = function() {
    root.genev = prevGenev;
    return genev;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = genev;
    }
    exports.genev = genev;
  } else {
    root.genev = genev;
  }

}).call(this);
