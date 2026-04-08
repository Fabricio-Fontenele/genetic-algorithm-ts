import type { Individual } from '@src/domain/Individual'
import type { ICrossoverStrategy } from '@src/domain/interfaces'

export class UniformCrossover implements ICrossoverStrategy {
  crossover(parentA: Individual, parentB: Individual): [number[], number[]] {
    if (parentA.genes.length !== parentB.genes.length) {
      throw new Error('Parents must have the same gene length for uniform crossover.')
    }

    const offspringAGenes: number[] = []
    const offspringBGenes: number[] = []

    const totalGenes = parentA.genes.length

    for (let currentGeneIndex = 0; currentGeneIndex < totalGenes; currentGeneIndex++) {
      const coinFlip = Math.random()
      const isHeads = coinFlip < 0.5

      const geneFromParentA = parentA.genes[currentGeneIndex]
      const geneFromParentB = parentB.genes[currentGeneIndex]

      if (geneFromParentA === undefined || geneFromParentB === undefined) {
        throw new Error(`Missing gene value at index ${currentGeneIndex}.`)
      }

      if (isHeads) {
        offspringAGenes.push(geneFromParentA)
        offspringBGenes.push(geneFromParentB)
      } else {
        offspringAGenes.push(geneFromParentB)
        offspringBGenes.push(geneFromParentA)
      }
    }

    return [offspringAGenes, offspringBGenes]
  }
}
