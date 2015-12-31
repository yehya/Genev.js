/*global $, jQuery, i, j, ii*/

var GF = function (CHROMO_STRUCTURE, options) {
    
    "use strict";

    // Check for invalid parameter CHROMO_STRUCTURE
    if ((typeof CHROMO_STRUCTURE === "undefined") || (typeof CHROMO_STRUCTURE !== "object")) {
        // console.error("Invalid parameter passed to GF. You need to pass a chromosome structure.");
        return null;
    }
    
    ///////////////////////////////////////////////////////////
    //      START OF PRIVATE CLASS METHODS/PROPERTIES
    ///////////////////////////////////////////////////////////

    /** Object that represents all of the class private methods and properties. */
    var gfprivate = {};

    // Chromosome structure
    gfprivate.CHROMO_STRUCTURE = CHROMO_STRUCTURE;

    // Default options
    gfprivate.DEFAULT_OPTIONS = {
        MAX_POPULATION_SIZE: 45,
        MAX_GENERATIONS: 100,
        MUTATION_PROB: 0.05,
        NUM_TO_SELECT: 10
    };

    // Setting default options 
    $.extend(gfprivate, gfprivate.DEFAULT_OPTIONS);

    // Maximum population size
    gfprivate.MAX_POPULATION_SIZE = 45; // default to 45

    // Maximum number of generations
    gfprivate.MAX_GENERATIONS = 100; // default to 100

    // Mutation probability
    gfprivate.MUTATION_PROB = 0.05; // default to 5%

    // Selection number
    gfprivate.NUM_TO_SELECT = 10; // default to 10 tributes (they volunteer)

    // Chromosome atrributes
    gfprivate.chromosome = {
        genes: {},
        score: 0
    };

    // Generation Population Array
    gfprivate.population = [];

    // Sort (descending) chromosomes based on score
    gfprivate.sortPopulation = function () {
        gfprivate.population.sort(function (a,b) {
            return b.score - a.score; // descending score order
        });
    };

    // Crossover Xgene and Ygene and return crossover
    gfprivate.crossover = function (Xchromo, Ychromo) {
        var crossedChromo = $.extend({},gfprivate.chromosome),
            property;
        for (property in Xchromo.genes) {
            if (Xchromo.genes.hasOwnProperty(property)) {
                // 50/50 chance of picking a gene from either
                crossedChromo.genes[property] = ((Math.random() > 0.5) ? Xchromo.genes[property] : Ychromo.genes[property]);
            }
        }
        return $.extend({},crossedChromo);
    };

    // Mutate individual chromosomes
    gfprivate.getMutated = function (chromo) {
        var mutatedChromo = $.extend({},gfprivate.chromosome),
            property;
        for (property in chromo.genes) {
            if (chromo.genes.hasOwnProperty(property)) {
                mutatedChromo.genes[property] = ((Math.random() < gfprivate.MUTATION_PROB) ? Math.random() : chromo.genes[property]);
            }
        }
        return mutatedChromo;
    };

    // Generates a new random chromosome using the structure provided
    gfprivate.generateChromosome = function () {
        var newChromosome = gfprivate.CHROMO_STRUCTURE,
            property;
        for (property in newChromosome.genes) {
            if (newChromosome.genes.hasOwnProperty(property)) {
                newChromosome.genes[property] = Math.random();
            }
        }
        return newChromosome;
    };

    // Default fitness function (should be replaced with custom function by framework user)
    gfprivate.fitnessFunction = function (genes) {
        var property;
        for (property in genes) {
            if (genes.hasOwnProperty(property)) {
                return genes[property];
            }
        }
    };
    
    // Evaluate scores of all chromosomes and sets their score property
    gfprivate.evaluate = function () {
        for (var i = 0; i < gfprivate.population.length; i+=1) {
            var score = { score: gfprivate.fitnessFunction(gfprivate.population[i].genes)};
            $.extend(gfprivate.population[i],score);
        }
    }
    
    // Selects the most fit in the population
    gfprivate.selectFittest = function () {
        gfprivate.sortPopulation();
        gfprivate.population.splice(gfprivate.NUM_TO_SELECT);
    }
    
    // Selects random chromosomes in a population
    gfprivate.selectRandom = function (selectionPop) {
        gfprivate.population = [];
        for (var i = 0; i < gfprivate.MAX_POPULATION_SIZE; i += 1) {
            var selector = Math.floor(Math.random()*selectionPop.length); // Random number from 0 to selectionPop.length
            gfprivate.population.push($.extend({},selectionPop[selector])); // add the selected value to the population
        }
    }
    
    /** Crossover the entire population in gfprivate.population
     * This method has the efficiency class of O(n^2) but is usually run on the fittest
     * chromosomes selected (which are only 10 by default). Keep this in mind when changing the
     * default ```NUM_SELECTED``` option.
     */
    gfprivate.crossPopulation = function () {
        var crossoverPopulation = [];
        // Crosses all n chromosomes with all other n-1 chromosomes
        for (var i = 0; i < gfprivate.population.length; i += 1) {
            for (var ii = 1; ii < gfprivate.population.length - i; ii += 1) {
                // 50/50 chance for selecting genes
                var crossoverChromosome = $.extend({},gfprivate.crossover(gfprivate.population[i], gfprivate.population[ii]));
                crossoverPopulation.push(JSON.parse(JSON.stringify(crossoverChromosome))); // HACK SOLUTION FOR REFERENCE PROBLEM, TODO REPLACE THIS
            }
        }
        gfprivate.selectRandom(crossoverPopulation);
    }
    
    // Mutate population
    gfprivate.mutate = function () {
        for (var i = 0; i < gfprivate.population.length; i += 1) {
            gfprivate.population[i] = JSON.parse(JSON.stringify(gfprivate.getMutated(gfprivate.population[i]))); // HACK, TODO FIX
        }
    }

    ///////////////////////////////////////////////////////////
    //             START OF PUBLIC METHODS/API
    ///////////////////////////////////////////////////////////
    
    // Class public methods/properties
    var gfpublic = {};

    gfpublic.initPopulation = function (chromosomeStruct) {
        /* CREATE RANDOM POPULATION */
        for (var i = 0; i < gfprivate.MAX_POPULATION_SIZE; i += 1) {
            // Create new random chromosome
            var newChromosome = $.extend(true, {}, gfprivate.generateChromosome());
            // Add it to the population
            gfprivate.population.push(newChromosome);
        }
    };

    gfpublic.evolve = function (evolveOptions, fitfunc) {
        // Update options again.
        $.extend(gfprivate, evolveOptions);

        // The generation counter
        var generationCount = gfprivate.MAX_GENERATIONS;

        // Set the fitness function if it was passed in
        if (typeof fitfunc === "function") {
            gfprivate.fitnessFunction = fitfunc;
        }

        // Abort
        // If the population is not initialized
        if (!gfprivate.population.length) {
            // console.error("No population initialized. Hint: Use .initPopulation before .evolve");
            return;
        }
        
        // Loops for each generation
        while (generationCount--) {
            /* START EVOLUTION */
            
            /* EVALUATION PHASE */

            gfprivate.evaluate(); // Test all chromosomes and score them
            
            /* SELECTION PHASE */

            gfprivate.selectFittest(); // Select most fit chromosomes in terms of score attribute

            /* CROSSOVER & MUTATION PHASE */
            
            gfprivate.crossPopulation();
            gfprivate.mutate();
            
            /* REPEAT UNTIL LAST GENERATION */
        }
        
        /* END EVOLUTION */
        gfprivate.evaluate();
        gfprivate.selectFittest();
    };

    // Resets all options to the defaults
    gfpublic.resetOptions = function () {
        $.extend(gfprivate, gfprivate.DEFAULT_OPTIONS);
    };
    
    // Pretty straightforward
    gfpublic.getPopulation = function () {
        return gfprivate.population;
    }

    // Options merging
    $.extend(gfprivate, options);
    
    // Return class public methods (a.k.a. make them available for use)
    return gfpublic;
};