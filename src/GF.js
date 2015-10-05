var GF = function (GENE_STRUCTURE) {

	// Class Private methods/properties
	var private = {};

	// Gene structure
	private.GENE_STRUCTURE = GENE_STRUCTURE; // Gene structure

	// Maximum population size
	private.MAX_POPULATION_SIZE = 45; // default to 50

	// Maximum number of generations
	private.MAX_GENERATIONS = 100; // default to 100

	// Mutation probability
	private.MUTATION_PROB = 0.05;

	// Selection number
	private.NUM_TO_SELECT = 10;

	// Chromosome atrributes
	private.chromosome = {
		genes: {},
		score: 0
	};

	// Generation Population Array
	private.population = [];

	// Tests a single chromosome's fitness and returns the score
	private.getFitnessScore = function (genes) {
		var score = private.fitnessFunction(genes);
		return score;
	};

	// Sort (descending) chromosomes based on score
	private.sortPopulation = function () {
		
	};

	// Crossover Xgene and Ygene and return crossover
	private.crossover = function (Xgenes, Ygenes) {
		var crossedGenes = {};
		for (var property in Xgene) {
			if (Xgene.hasOwnProperty(property)) {
				// 50/50 chance of picking a gene from either
				crossedGenes = ((Math.random() > 0.5) ? Xgenes[property] : Ygenes[property]);
			}
		}
	};

	// Mutate individual chromosomes
	private.getMutated = function (genes) {
		var mutatedGene = {};
		for (var property in genes) {
			if (genes.hasOwnProperty(property)) {
				var mutatedGene[property] = ((Math.random() < private.MUTATION_PROB) ? Math.random() : genes[property] );
			}
		}	
		return mutatedGene;
	};

	// Generates a new random chromosome using the structure provided
	private.generateChromosome = function () {
		var newChromosome = private.GENE_STRUCTURE;
		for (var property in newChromosome) {
			if (newChromosome.hasOwnProperty(property)) {
				newChromosome[property] = Math.random();	
			}
		}
		return newChromosome;
	};

	// Default fitness function (should be replaced with custom function by framework user)
	private.fitnessFunction = function (genes) {
		var score = 0;
		// Do stuff using the genes
		// Return score
		return score;
	};

	// Class Public methods/properties
	var public = {};

	public.initPopulation = function (chromosomeStruct) {

		/* CREATE RANDOM POPULATION */

		for (i = 0; i <= private.MAX_POPULATION_SIZE; i += 1) {
			// Create new random chromosome
			var newChromosome = private.generateChromosome();
			// Add it to the population
			private.population.push(newChromosome);
		};
	};

	public.evolve = function (fitnessFunction) {

		// The generation counter
		var generationCount = private.MAX_GENERATIONS;

		// Set the fitness function
		private.fitnessFunction = fitnessFunction;

		// Abort
		// If the population is not initialized
		if (private.population.empty()) {
			console.error("No population initialized. Hint: Use .init before .evolve");
			return;
		};

		while (generationCount--) {

			/* EVALUATION PHASE */

			// Pass all chromosomes to fitness function and get all scores
			for (i = 0; i <= private.population.length; i += 1) {
				// Get the fitness core
				var score = private.getFitnessScore(private.population[i].genes);
				// Set the score property of the chromosome
				private.population[i].score = score;
			};

			/* SELECTION PHASE */

			// Sort most fit to least fit chromosomes
			private.sortPopulation();
			// Select best chromosomes
			var fittestChromosomes = [];
			for (k = 0; k < private.NUM_TO_SELECT; k += 1) {
				fittestChromosomes.push(private.population[k]);
			}

			/* CROSSOVER & MUTATION PHASE */

			var crossoverPopulation = [];
			for (j = 0; j < fitnessFunction.length; j += 1) {
				for (jj = 1; jj < fitnessFunction.length - j; jj += 1) {
					// 50/50 chance for selecting genes
					var crossoverChromosome = private.crossover(private.population[j], private.population[jj]);
					crossoverPopulation.push(crossoverChromosome);
				}
			}

			/* ASSIGN CROSS OVER AS NEW POPULATION */

			private.population = crossoverPopulation;

			/* REPEAT UNTIL LAST GENERATION */
		}
	};

	return public;
};
