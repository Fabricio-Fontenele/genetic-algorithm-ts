import type { IFitnessFunction } from '@src/domain/interfaces'

export class CountingFitnessFunction implements IFitnessFunction {
  public evaluations = 0

  constructor(private baseFitness: IFitnessFunction) {}

  get upperBound(): number {
    return this.baseFitness.upperBound
  }

  get lowerBound(): number {
    return this.baseFitness.lowerBound
  }

  get dimension(): number {
    return this.baseFitness.dimension
  }

  calculateFitness(genes: number[]): number {
    this.evaluations++
    return this.baseFitness.calculateFitness(genes)
  }
}
