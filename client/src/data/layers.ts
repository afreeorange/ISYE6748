import L1_Data from "./layer_1__filtered.json";
import L2_Data from "./layer_2__filtered.json";
import L3_Data from "./layer_3__filtered.json";

type L1_Class = keyof typeof L1_Data;
type L2_Class = keyof typeof L2_Data;
type L3_Class = keyof typeof L3_Data;

export type LayerNumber = 1 | 2 | 3;
export type LayerClass = L1_Class | L2_Class | L3_Class;

export type Condition = {
  children: string[];
  code: string;
  description: string;
  displayCode: string;
  hierarchy: string[];
  layer: number;
  weight: number;
};

/**
 * This is what we get from the upstream API. We can certainly push this
 * processing up there (or at least front the Python API with tRPC...)
 *
 * E.g.
 *
 *    [
 *      ["A00_B99", 1],
 *      ["C00_D49", 2],
 *      ["D50_D89", 4],
 *      ["E00_E89", 4],
 *    ]
 */
export type LayerFrequencies = [LayerClass, number][];

export const LAYER_NAME: Record<
  number,
  Record<"full" | "singular" | "short" | "adverb", string>
> = {
  1: {
    full: "Very Broad Conditions",
    singular: "Very Broad Condition",
    short: "Very Broad",
    adverb: "Very Broadly",
  },
  2: {
    full: "Broad Conditions",
    singular: "Broad Condition",
    short: "Broad",
    adverb: "Broadly",
  },
  3: {
    full: "Specific Conditions",
    singular: "Specific Condition",
    short: "Specific",
    adverb: "Specifically",
  },
} as const;
export const N = LAYER_NAME;

/**
 * Create giant, smushed map and list of the ICD-10 codes we will search. We do
 * not want to mutate these things.
 */

export const ICD10_CODE_LIST: Readonly<Condition[]> = [
  ...Object.keys(L1_Data).map((_) => ({
    ...L1_Data[_ as L1_Class],
  })),
  ...Object.keys(L2_Data).map((_) => ({
    ...L2_Data[_ as L2_Class],
  })),
  ...Object.keys(L3_Data).map((_) => ({
    ...L3_Data[_ as L3_Class],
  })),
] as const;
export const L = ICD10_CODE_LIST;

export const ICD10_CODE_MAP: Readonly<Record<string | LayerClass, Condition>> =
  {
    ...L1_Data,
    ...L2_Data,
    ...L3_Data,
  } as const;
export const M = ICD10_CODE_MAP;
