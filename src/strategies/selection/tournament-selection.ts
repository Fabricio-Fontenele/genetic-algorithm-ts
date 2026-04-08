import type { Individual } from '@src/domain/Individual'
import type { ISelectionStrategy } from '@src/domain/interfaces'

export class TournamentSelection implements ISelectionStrategy {
  constructor(private tournamentSize: number = 3) {}

  select(population: Individual[]): Individual[] {
    if (population.length === 0) {
      throw new Error('Population cannot be empty.')
    }

    const parent1 = this.runTournament(population)
    const parent2 = this.runTournament(population, population.length > 1 ? parent1 : undefined)

    return [parent1, parent2]
  }

  private runTournament(population: Individual[], excluded?: Individual): Individual {
    const candidatePool =
      excluded !== undefined ? population.filter((individual) => individual !== excluded) : population
    const pool = candidatePool.length > 0 ? candidatePool : population
    const effectiveTournamentSize = Math.min(this.tournamentSize, pool.length)

    if (effectiveTournamentSize === 0) {
      throw new Error('Tournament requires at least one candidate.')
    }

    let bestContender: Individual | null = null
    const selectedIndices = this.sampleUniqueIndices(pool.length, effectiveTournamentSize)

    for (const selectedIndex of selectedIndices) {
      const contender = pool[selectedIndex]!

      if (bestContender === null || contender.fitness < bestContender.fitness) {
        bestContender = contender
      }
    }

    return bestContender!
  }

  private sampleUniqueIndices(poolSize: number, count: number): number[] {
    const chosen = new Set<number>()

    while (chosen.size < count) {
      chosen.add(Math.floor(Math.random() * poolSize))
    }

    return [...chosen]
  }
}
