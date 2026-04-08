import type { IMutationStrategy } from '@src/domain/interfaces'

export class SimpleMutation implements IMutationStrategy {
  constructor(
    private mutationRate: number,
    private lowerBound: number,
    private upperBound: number,
  ) {}

  mutate(genes: number[]): number[] {
    const mutatedGenes: number[] = []

    for (let currentGeneIndex = 0; currentGeneIndex < genes.length; currentGeneIndex++) {
      const originalGeneValue = genes[currentGeneIndex]!
      const shouldMutate = Math.random() < this.mutationRate

      if (shouldMutate) {
        const randomValueRange = this.upperBound - this.lowerBound
        const brandNewGeneValue = this.lowerBound + Math.random() * randomValueRange

        mutatedGenes.push(brandNewGeneValue)
      } else {
        mutatedGenes.push(originalGeneValue)
      }
    }

    return mutatedGenes
  }
}
