import type { Individual } from '@src/domain/Individual'
import type { ISelectionStrategy } from '@src/domain/interfaces'

export class RankSelection implements ISelectionStrategy {
  select(population: Individual[]): Individual[] {
    if (population.length === 0) {
      throw new Error('Population cannot be empty.')
    }

    const sortedPopulation = [...population].sort((a, b) => a.fitness - b.fitness)
    const parent1 = this.pickByRank(sortedPopulation)

    const candidatePool = sortedPopulation.length > 1
      ? sortedPopulation.filter((individual) => individual !== parent1)
      : sortedPopulation
    const parent2 = this.pickByRank(candidatePool)

    return [parent1, parent2]
  }

  private pickByRank(population: Individual[]): Individual {
    const totalIndividuals = population.length

    if (totalIndividuals === 0) {
      throw new Error('Rank selection requires at least one individual.')
    }

    const totalRankWeight = (totalIndividuals * (totalIndividuals + 1)) / 2
    const randomThreshold = Math.random() * totalRankWeight
    let accumulatedWeight = 0

    for (let index = 0; index < totalIndividuals; index++) {
      const individual = population[index]
      if (individual === undefined) {
        throw new Error(`Missing individual at index ${index}.`)
      }

      const weight = totalIndividuals - index
      accumulatedWeight += weight

      if (accumulatedWeight >= randomThreshold) {
        return individual
      }
    }

    return population[totalIndividuals - 1]!
  }
}
