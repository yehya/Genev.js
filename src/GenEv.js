/*global $, jQuery, alert, console, i, j, ii*/

var GF = function (GENE_STRUCTURE, options) {
    
    "use strict";

    // Check for invalid parameter GENE_STRUCTURE
    if ((typeof GENE_STRUCTURE === "undefined")) {
        console.error("Invalid parameter passed to GF. You need to pass a gene structure.");
        return null;
    }

    // Class private methods/properties
    var gfprivate = {};

    // Gene structure
    gfprivate.GENE_STRUCTURE = GENE_STRUCTURE;

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
    gfprivate.NUM_TO_SELECT = 10; // default to 10 tributes (they volunteer as tribute)

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
    gfprivate.crossover = function (Xgenes, Ygenes) {
        var crossedGenes = {},
            property;
        for (property in Xgenes) {
            if (Xgenes.hasOwnProperty(property)) {
                // 50/50 chance of picking a gene from either
                crossedGenes = ((Math.random() > 0.5) ? Xgenes[property] : Ygenes[property]);
            }
        }
    };

    // Mutate individual chromosomes
    gfprivate.getMutated = function (genes) {
        var mutatedGene = {},
            property;
        for (property in genes) {
            if (genes.hasOwnProperty(property)) {
                mutatedGene[property] = ((Math.random() < gfprivate.MUTATION_PROB) ? Math.random() : genes[property]);
            }
        }
        return mutatedGene;
    };

    // Generates a new random chromosome using the structure provided
    gfprivate.generateChromosome = function () {
        var newChromosome = gfprivate.GENE_STRUCTURE,
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
        for (i = 0; i < gfprivate.population.length; i+=1) {
            var score = { score: gfprivate.fitnessFunction(gfprivate.population[i].genes)};
            $.extend(gfprivate.population[i],score);
        }
    }
    
    // Selects the most fit in the population
    gfprivate.select = function () {
        var fittestChromosomes = [];
        // Since they are sorted we simply select the first NUM_TO_SELECT
        for (i = 0; i < gfprivate.NUM_TO_SELECT; i += 1) {
            fittestChromosomes.push(gfprivate.population[i]);
        }
    }
    
    // Crossover of the most fit
    gfprivate.cross = function () {
        var crossoverPopulation = [];
        for (i = 0; i < gfprivate.population.length; i += 1) {
            for (ii = 1; ii < gfprivate.population.length - i; ii += 1) {
                // 50/50 chance for selecting genes
                var crossoverChromosome = gfprivate.crossover(gfprivate.population[i], gfprivate.population[ii]);
                crossoverPopulation.push(crossoverChromosome);
            }
        }
    }
    
    // Mutate population
    gfprivate.mutate = function () {
        
    }

    // Class public methods/properties
    var gfpublic = {};

    gfpublic.initPopulation = function (chromosomeStruct) {
        /* CREATE RANDOM POPULATION */
        for (i = 0; i < gfprivate.MAX_POPULATION_SIZE; i += 1) {
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

        // Set the fitness function
        if (typeof fitfunc === "function") {
            gfprivate.fitnessFunction = fitfunc;
        }

        // Abort
        // If the population is not initialized
        if (!gfprivate.population.length) {
            console.error("No population initialized. Hint: Use .init before .evolve");
            return;
        }
        
        // Loops for each generation
        while (generationCount--) {
            /* START EVOLUTION */
            
            /* EVALUATION PHASE */

            gfprivate.evaluate(); // Test all chromosomes and score them
            
            /* SELECTION PHASE */

            gfprivate.sortPopulation(); // Sort most fit to least fit chromosomes
            gfprivate.select(); // Select best chromosomes

            /* CROSSOVER & MUTATION PHASE */
            
            gfprivate.cross();
            gfprivate.mutate();

            /* REPEAT UNTIL LAST GENERATION */
        }
    };

    // Resets all options to the defaults
    gfpublic.resetOptions = function () {
        $.extend(gfprivate, gfprivate.DEFAULT_OPTIONS);
    };
    
    // Pretty straightforward
    gfpublic.getPopulation = function () {
        return gfprivate.population;
    }

    // Options merging (requires Jquery)
    $.extend(gfprivate, options);
    
    // Return class public methods (a.k.a. make them available for use)
    return gfpublic;
};