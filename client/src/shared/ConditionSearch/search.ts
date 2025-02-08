import Fuse, { FuseResult } from "fuse.js";
import { ICD10_CODE_LIST, type Condition } from "../../data/layers";

export const LAYER_SEARCH_RESULT_LIMIT = 25;

export type LayerSearchResult = FuseResult<Condition>;
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
    const layer = ICD10_CODE_LIST[codeIndices[i]];
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

const conditionFuzzySearcher = new Fuse(ICD10_CODE_LIST, {
  includeScore: true,
  keys: ["code", "description"],
});

export const searchICDCodesLocally = (term: string) =>
  term.trim() !== "" ? conditionFuzzySearcher.search(term.trim()) : [];
