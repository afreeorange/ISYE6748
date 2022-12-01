import LayerOneData from "./layer_1__filtered.json";
import LayerTwoData from "./layer_2__filtered.json";
import LayerThreeData from "./layer_3__filtered.json";

export type LayerNumber = 1 | 2 | 3;
export type LayerOneClass = keyof typeof LayerOneData;
export type LayerTwoClass = keyof typeof LayerTwoData;
export type LayerThreeClass = keyof typeof LayerThreeData;
export type LayerClass = LayerOneClass | LayerTwoClass | LayerThreeClass;

export type Layer = {
  children: string[];
  code: string;
  description: string;
  displayCode: string;
  hierarchy: string[];
  layer: number;
  weight: number;
};

/**
 * Aliasing a few of these with shortnames since (a) they're looked up a lot by
 * all the components and (b) helps 'clean up' the component that uses them
 * apropos visual noise.
 */

export const LAYER_NAMES: Record<number, string> = {
  // 4: "Very Specific Conditions",
  3: "Specific Conditions",
  2: "Broad Conditions",
  1: "Very Broad Conditions",
};
export const LN = LAYER_NAMES;

export const LAYER_NAMES_SINGULAR: Record<number, string> = {
  // 4: "Very Specific Condition",
  3: "Specific Condition",
  2: "Broad Condition",
  1: "Very Broad Condition",
};
export const LNSi = LAYER_NAMES_SINGULAR;

export const LAYER_NAMES_SHORT: Record<number, string> = {
  // 4: "Very Specific",
  3: "Specific",
  2: "Broad",
  1: "Very Broad",
};
export const LNSh = LAYER_NAMES_SHORT;

export const LAYER_NAMES_SHORT_LOWER: Record<number, string> = {
  // 4: "Very Specific",
  3: "specific",
  2: "broad",
  1: "very broad",
};
export const LNShlo = LAYER_NAMES_SHORT;

export const LAYER_NAMES_ADVERBS: Record<number, string> = {
  // 4: "Very Specifically",
  3: "Specifically",
  2: "Broadly",
  1: "Very Broadly",
};
export const LNSa = LAYER_NAMES_ADVERBS;

/**
 * Create a giant, smushed list of objects to search. We will NOT mutate this
 * this list. HENCE_THE_YELLING. DO NOT MUTATE THIS LIST.
 */
export const GIANT_LIST_OF_ICD10_CODES_TO_SEARCH: Readonly<Layer[]> = [
  ...Object.keys(LayerOneData).map((_) => ({
    ...LayerOneData[_ as LayerOneClass],
  })),
  ...Object.keys(LayerTwoData).map((_) => ({
    ...LayerTwoData[_ as LayerTwoClass],
  })),
  ...Object.keys(LayerThreeData).map((_) => ({
    ...LayerThreeData[_ as LayerThreeClass],
  })),
] as const;
export const L = GIANT_LIST_OF_ICD10_CODES_TO_SEARCH;

export const GIANT_MAP_OF_ICD10_CODES_TO_SEARCH: Readonly<
  Record<string | LayerClass, Layer>
> = {
  ...LayerOneData,
  ...LayerTwoData,
  ...LayerThreeData,
} as const;
export const M = GIANT_MAP_OF_ICD10_CODES_TO_SEARCH;
