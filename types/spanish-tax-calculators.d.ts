declare module "spanish-tax-calculators" {
  export function calcIrpfState(base: number): number;
  export function calcIrpfRegional(base: number, region: string): number;

  export function calcPersonalMinimum(params: {
    age?: number;
    numChildren?: number;
    childrenUnder3?: number;
    disabilityLevel?: 0 | 33 | 65;
  }): number;
}
