import Fuse from "fuse.js";

import { GIANT_LIST_OF_ICD10_CODES_TO_SEARCH, Layer } from "../layers";

export const LAYER_SEARCH_RESULT_LIMIT = 25;

export type LayerSearchResult = Fuse.FuseResult<Layer>;
export type LayerSearchResults = LayerSearchResult[];

export type CodeSearchSubmission = Record<number, string[]>;

export const prepareCodesForSubmission = (
  codeIndices: number[]
): CodeSearchSubmission => {
  const submission: CodeSearchSubmission = {
    1: [],
    2: [],
    3: [],
  };

  for (let i = 0; i < codeIndices.length; i++) {
    const layer = GIANT_LIST_OF_ICD10_CODES_TO_SEARCH[codeIndices[i]];
    submission[layer.layer].push(layer.hierarchy[0]);
  }

  /**
   * Now that we've collected the codes, we dedupe!
   */
  for (const _ in submission) {
    submission[_] = submission[_].filter((v, i, s) => s.indexOf(v) === i);
  }

  return submission;
};

const conditionFuzzySearcher = new Fuse(GIANT_LIST_OF_ICD10_CODES_TO_SEARCH, {
  includeScore: true,
  keys: ["code", "description"],
});

export const searchICDCodesLocally = (term: string) =>
  term.trim() !== "" ? conditionFuzzySearcher.search(term.trim()) : [];
