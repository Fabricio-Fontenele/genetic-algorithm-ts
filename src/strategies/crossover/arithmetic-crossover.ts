import type { Individual } from '@src/domain/Individual'
import type { ICrossoverStrategy } from '@src/domain/interfaces'

export class ArithmeticCrossover implements ICrossoverStrategy {
  crossover(parentA: Individual, parentB: Individual): [number[], number[]] {
    if (parentA.genes.length !== parentB.genes.length) {
      throw new Error('Parents must have the same gene length for arithmetic crossover.')
    }

    const offspringAGenes: number[] = []
    const offspringBGenes: number[] = []

    const totalGenes = parentA.genes.length

    for (let currentGeneIndex = 0; currentGeneIndex < totalGenes; currentGeneIndex++) {
      const weightForParentA = Math.random()
      const weightForParentB = 1 - weightForParentA

      const geneFromParentA = parentA.genes[currentGeneIndex]
      const geneFromParentB = parentB.genes[currentGeneIndex]

      if (geneFromParentA === undefined || geneFromParentB === undefined) {
        throw new Error(`Missing gene value at index ${currentGeneIndex}.`)
      }

      const blendedGeneForOffspringA = weightForParentA * geneFromParentA + weightForParentB * geneFromParentB
      const blendedGeneForOffspringB = weightForParentB * geneFromParentA + weightForParentA * geneFromParentB

      offspringAGenes.push(blendedGeneForOffspringA)
      offspringBGenes.push(blendedGeneForOffspringB)
    }

    return [offspringAGenes, offspringBGenes]
  }
}
