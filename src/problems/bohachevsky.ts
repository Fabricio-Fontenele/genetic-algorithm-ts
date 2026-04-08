import type { IFitnessFunction } from "../domain/interfaces";

export class BohachevskyProblem implements IFitnessFunction {
  public readonly lowerBound: number = -50;
  public readonly upperBound: number = 50;
  public readonly dimension: number = 2;

  public calculateFitness(genes: number[]): number {
    const [g1, g2] = this.getRequiredGenes(genes);

    const term1 = Math.pow(g1, 2) + 2 * Math.pow(g2, 2);
    const term2 = -0.3 * Math.cos(3 * Math.PI * g1);
    const term3 = -0.4 * Math.cos(4 * Math.PI * g2);

    return term1 + term2 + term3 + 0.7;
  }

  private getRequiredGenes(genes: number[]): [number, number] {
    if (genes.length !== this.dimension) {
      throw new Error(
        `Bohachevsky problem expects exactly ${this.dimension} genes, but received ${genes.length}.`,
      );
    }

    const [g1, g2] = genes;

    if (g1 === undefined || g2 === undefined) {
      throw new Error("Bohachevsky problem received an incomplete gene vector.");
    }

    return [g1, g2];
  }
}
