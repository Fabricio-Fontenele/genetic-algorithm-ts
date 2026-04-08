import { GeneticAlgorithm } from './core/genetic-algorithm'
import type { ICrossoverStrategy, IFitnessFunction, IMutationStrategy, ISelectionStrategy } from './domain/interfaces'
import { BohachevskyProblem } from './problems/bohachevsky'
import { CamelBack3Problem } from './problems/camelback3'
import { ArithmeticCrossover } from './strategies/crossover/arithmetic-crossover'
import { SimpleMutation } from './strategies/mutation/simple-mutation'
import { RankSelection } from './strategies/selection/rank-selection'
import { TournamentSelection } from './strategies/selection/tournament-selection'
import { CountingFitnessFunction } from './utils/counting-fitness-function'

const TOTAL_RUNS = 100
const TARGET_FITNESS = 0
const TOLERANCE = 0.01

const GA_PARAMS = {
  populationSize: 100,
  maxGenerations: 1000,
  elitismCount: 2,
  crossoverRate: 0.9,
  mutationRate: 0.01,
}

function runExperiment(
  problemName: string,
  problemInstance: IFitnessFunction,
  selectionStrategy: ISelectionStrategy,
  crossoverStrategy: ICrossoverStrategy,
  mutationStrategy: IMutationStrategy,
) {
  let successCount = 0
  let totalNfe = 0

  for (let i = 1; i <= TOTAL_RUNS; i++) {
    const problem = new CountingFitnessFunction(problemInstance)

    const ga = new GeneticAlgorithm(
      problem,
      selectionStrategy,
      crossoverStrategy,
      mutationStrategy,
      GA_PARAMS.populationSize,
      GA_PARAMS.maxGenerations,
      GA_PARAMS.crossoverRate,
      GA_PARAMS.elitismCount,
      TOLERANCE,
    )

    const bestIndividual = ga.execute()

    totalNfe += problem.evaluations

    if (Math.abs(bestIndividual.fitness - TARGET_FITNESS) < TOLERANCE) {
      successCount++
    }
  }

  const averageNfe = Math.round(totalNfe / TOTAL_RUNS)
  const successRate = (successCount / TOTAL_RUNS) * 100

  console.log(`| **${problemName}** | ${problemInstance.dimension} | ${averageNfe} | ${successRate.toFixed(2)}% |`)
}

console.log('Iniciando bateria de testes...\n')
console.log('=== RESULTADOS FINAIS ===')
console.log('| Problem | n | NFE (media) | SR |')
console.log('| :--- | :--- | :--- | :--- |')

const bohachevsky = new BohachevskyProblem()
runExperiment(
  'BF1',
  bohachevsky,
  new TournamentSelection(3),
  new ArithmeticCrossover(),
  new SimpleMutation(GA_PARAMS.mutationRate, bohachevsky.lowerBound, bohachevsky.upperBound),
)

const camelBack = new CamelBack3Problem()
runExperiment(
  'CB3',
  camelBack,
  new RankSelection(),
  new ArithmeticCrossover(),
  new SimpleMutation(GA_PARAMS.mutationRate, camelBack.lowerBound, camelBack.upperBound),
)
