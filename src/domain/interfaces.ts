import type { Individual } from "./Individual";

export interface IFitnessFunction {
  upperBound: number;
  lowerBound: number;
  dimension: number;
  calculateFitness(genes: number[]): number;
}

export interface ISelectionStrategy {
  select(population: Individual[]): Individual[];
}

export interface ICrossoverStrategy {
  crossover(parent1: Individual, parent2: Individual): [number[], number[]];
}

export interface IMutationStrategy {
  mutate(genes: number[]): number[];
}
