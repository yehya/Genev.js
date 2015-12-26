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

    // Tests a single chromosome's fitness and returns the score
    gfprivate.getFitnessScore = function (genes) {
        var score = gfprivate.fitnessFunction(genes);
        return score;
    };

    // Sort (descending) chromosomes based on score
    gfprivate.sortPopulation = function () {

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
        for (property in newChromosome) {
            if (newChromosome.hasOwnProperty(property)) {
                newChromosome[property] = Math.random();
            }
        }
        return newChromosome;
    };

    // Default fitness function (should be replaced with custom function by framework user)
    gfprivate.fitnessFunction = function (genes) {
        var score = 0;
        // Do stuff using the genes
        // Return score
        return score;
    };

    // Class public methods/properties
    var gfpublic = {};

    gfpublic.initPopulation = function (chromosomeStruct) {

        /* CREATE RANDOM POPULATION */
        var i;
        for (i = 0; i <= gfprivate.MAX_POPULATION_SIZE; i += 1) {
            // Create new random chromosome
            var newChromosome = gfprivate.generateChromosome();
            // Add it to the population
            gfprivate.population.push(newChromosome);
        };
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
        if (gfprivate.population.empty()) {
            console.error("No population initialized. Hint: Use .init before .evolve");
            return;
        };

        while (generationCount--) {

            /* EVALUATION PHASE */

            // Pass all chromosomes to fitness function and get all scores
            for (var i = 0; i <= gfprivate.population.length; i += 1) {
                // Get the fitness core
                var score = gfprivate.getFitnessScore(gfprivate.population[i].genes);
                // Set the score property of the chromosome
                gfprivate.population[i].score = score;
            };

            /* SELECTION PHASE */

            // Sort most fit to least fit chromosomes
            gfprivate.sortPopulation();
            // Select best chromosomes
            var fittestChromosomes = [];
            for (var k = 0; k < gfprivate.NUM_TO_SELECT; k += 1) {
                fittestChromosomes.push(gfprivate.population[k]);
            }

            /* CROSSOVER & MUTATION PHASE */

            var crossoverPopulation = [];
            for (var j = 0; j < gfprivate.population.length; j += 1) {
                for (var jj = 1; jj < gfprivate.population.length - j; jj += 1) {
                    // 50/50 chance for selecting genes
                    var crossoverChromosome = gfprivate.crossover(gfprivate.population[j], gfprivate.population[jj]);
                    crossoverPopulation.push(crossoverChromosome);
                }
            }

            /* ASSIGN CROSS OVER AS NEW POPULATION */

            gfprivate.population = crossoverPopulation;

            /* REPEAT UNTIL LAST GENERATION */
        }
    };
    
    // Resets all options to the defaults
    gfpublic.resetOptions = function () {
        $.extend(gfprivate, gfprivate.DEFAULT_OPTIONS);
    }

    // Options merging (requires Jquery)
    $.extend(gfprivate, options);

    return gfpublic;
};
