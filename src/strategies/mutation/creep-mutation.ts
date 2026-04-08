import type { IMutationStrategy } from '@src/domain/interfaces'

export class CreepMutation implements IMutationStrategy {
  constructor(
    private mutationRate: number,
    private lowerBound: number,
    private upperBound: number,
    private mutationStep: number = 1.0,
  ) {}

  mutate(genes: number[]): number[] {
    const mutatedGenes: number[] = []

    for (let currentGeneIndex = 0; currentGeneIndex < genes.length; currentGeneIndex++) {
      const originalGeneValue = genes[currentGeneIndex]!
      const shouldMutate = Math.random() < this.mutationRate

      if (shouldMutate) {
        const noise = (Math.random() * 2 - 1) * this.mutationStep
        let nudgedGeneValue = originalGeneValue + noise

        if (nudgedGeneValue > this.upperBound) nudgedGeneValue = this.upperBound
        if (nudgedGeneValue < this.lowerBound) nudgedGeneValue = this.lowerBound

        mutatedGenes.push(nudgedGeneValue)
      } else {
        mutatedGenes.push(originalGeneValue)
      }
    }

    return mutatedGenes
  }
}
