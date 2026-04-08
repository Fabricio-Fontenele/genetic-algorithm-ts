import type { Individual } from '@src/domain/Individual';
import type {
  ICrossoverStrategy,
  IFitnessFunction,
  IMutationStrategy,
  ISelectionStrategy,
} from '@src/domain/interfaces'

export class GeneticAlgorithm {
  constructor(
    private fitnessFunction: IFitnessFunction,
    private selectionStrategy: ISelectionStrategy,
    private crossoverStrategy: ICrossoverStrategy,
    private mutationStrategy: IMutationStrategy,
    private populationSize: number = 100,
    private maxGenerations: number = 1000,
    private crossoverRate: number = 0.9,
    private elitismCount: number = 1,
    private targetFitnessThreshold?: number,
  ) {}

  public execute(): Individual {
    let population = this.initializePopulation()

    if (population.length === 0) {
      throw new Error('Population cannot be empty.')
    }

    let globalBest = population[0]!
    let generationsWithoutImprovement = 0

    for (let currentGeneration = 1; currentGeneration <= this.maxGenerations; currentGeneration++) {
      population.sort((a: Individual, b: Individual) => a.fitness - b.fitness)

      const generationBest = population[0]
      if (generationBest === undefined) {
        throw new Error('Population cannot be empty during execution.')
      }

      if (
        this.targetFitnessThreshold !== undefined
        && generationBest.fitness <= this.targetFitnessThreshold
      ) {
        return generationBest
      }

      if (generationBest.fitness < globalBest.fitness) {
        globalBest = generationBest
        generationsWithoutImprovement = 0
      } else {
        generationsWithoutImprovement++
      }

      if (generationsWithoutImprovement >= 20) {
        break
      }

      const newPopulation: Individual[] = []
      const eliteCount = Math.min(this.elitismCount, population.length)

      for (let i = 0; i < eliteCount; i++) {
        const elite = population[i]
        if (elite === undefined) {
          throw new Error(`Missing elite individual at index ${i}.`)
        }

        newPopulation.push({
          genes: [...elite.genes],
          fitness: elite.fitness,
        })
      }

      while (newPopulation.length < this.populationSize) {
        const selectedParents = this.selectionStrategy.select(population)
        const parent1 = selectedParents[0]
        const parent2 = selectedParents[1]

        if (parent1 === undefined || parent2 === undefined) {
          throw new Error('Selection strategy must return at least two parents.')
        }

        let offspring1Genes = [...parent1.genes]
        let offspring2Genes = [...parent2.genes]

        if (Math.random() < this.crossoverRate) {
          const [crossoverGenes1, crossoverGenes2] = this.crossoverStrategy.crossover(parent1, parent2)
          offspring1Genes = crossoverGenes1
          offspring2Genes = crossoverGenes2
        }

        const mutatedOffspring1Genes = this.mutationStrategy.mutate(offspring1Genes)
        const mutatedOffspring2Genes = this.mutationStrategy.mutate(offspring2Genes)

        newPopulation.push({
          genes: mutatedOffspring1Genes,
          fitness: this.fitnessFunction.calculateFitness(mutatedOffspring1Genes),
        })

        if (newPopulation.length < this.populationSize) {
          newPopulation.push({
            genes: mutatedOffspring2Genes,
            fitness: this.fitnessFunction.calculateFitness(mutatedOffspring2Genes),
          })
        }
      }

      population = newPopulation
    }

    return globalBest
  }

  private initializePopulation(): Individual[] {
    const initialPopulation: Individual[] = []

    for (let i = 0; i < this.populationSize; i++) {
      const genes: number[] = []

      for (let j = 0; j < this.fitnessFunction.dimension; j++) {
        const range = this.fitnessFunction.upperBound - this.fitnessFunction.lowerBound
        const randomGene = this.fitnessFunction.lowerBound + Math.random() * range
        genes.push(randomGene)
      }

      initialPopulation.push({ genes, fitness: this.fitnessFunction.calculateFitness(genes) })
    }

    return initialPopulation
  }
}

