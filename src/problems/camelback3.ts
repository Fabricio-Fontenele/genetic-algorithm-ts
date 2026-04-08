import type { IFitnessFunction } from '@src/domain/interfaces'

export class CamelBack3Problem implements IFitnessFunction {
  public readonly lowerBound = -5.0
  public readonly upperBound = 5.0
  public readonly dimension = 2

  calculateFitness(genes: number[]): number {
    this.ensureExpectedDimension(genes)
    const [x1, x2] = genes

    const term1 = 2 * Math.pow(x1!, 2)
    const term2 = 1.05 * Math.pow(x1!, 4)
    const term3 = Math.pow(x1!, 6) / 6
    const term4 = x1! * x2!
    const term5 = Math.pow(x2!, 2)

    return term1 - term2 + term3 + term4 + term5
  }

  private ensureExpectedDimension(genes: number[]): void {
    if (genes.length !== this.dimension) {
      throw new Error(`Ackley problem expects exactly ${this.dimension} genes, but received ${genes.length}.`)
    }
  }
}
