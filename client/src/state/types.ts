import React from "react";
import { Layer, LayerClass } from "../layers";
import { ConditionsResponse, SimilarityResponse } from "../services/api/types";

export type ProcessingState = "idle" | "processing" | "processed" | "error";

export type AnalysisType =
  /**
   * The double-underscored ones are just for the tabs/routing
   */
  | "__conditions"
  | "__patients"
  | "__patients_existing"
  | "__patients_new"
  /**
   * These are all the analyses we offer */
  | "conditions_recommendation"
  | "patients_existing_item_recommendation"
  | "patients_existing_user_similarity"
  | "patients_new_item_recommendation"
  | "patients_new_user_similarity"
  | null;

export type ConditionState = {
  conditionSearchTerm: string | null;
  conditionSearchData: Layer | null;
  conditionSearchState: ProcessingState;
  conditionSearchResults: ConditionsResponse | null;
};

export type ExistingPatientState = {
  existingPatientSearchTerm: string | null;
  existingPatientSearchState: ProcessingState;
  existingPatientSearchResults: SimilarityResponse | null;
};

export type NewPatientState = {
  newPatientConditions: Layer[];
  newPatientSearchState: ProcessingState;
  newPatientSearchResults: SimilarityResponse | null;
};

export type State = {
  activeAnalysis: AnalysisType;
  activeTab: number;
  preventedLawsuits: boolean;
  processingState: ProcessingState;
} & ConditionState &
  ExistingPatientState &
  NewPatientState;

export type Action =
  | { type: "SET_ANALYSIS_TYPE"; analysisType: State["activeAnalysis"] }
  | { type: "SET_ACTIVE_TAB"; tab: number }
  /**
   * Conditions
   */
  | { type: "SET_CONDITION_SEARCH_TERM"; term: string | null }
  | { type: "SET_CONDITION_SEARCH_DATA"; layer: Layer | null }
  | { type: "SET_CONDITION_SEARCH_STATE"; processingState: ProcessingState }
  | {
      type: "SET_CONDITION_SEARCH_RESULTS";
      results: ConditionsResponse | null;
    }
  /**
   * Existing Members
   */
  | { type: "SET_EXISTING_PATIENT_SEARCH_TERM"; term: string | null }
  | { type: "SET_EXISTING_PATIENT_STATE"; processingState: ProcessingState }
  | {
      type: "SET_EXISTING_PATIENT_RESULTS";
      results: SimilarityResponse | null;
    }
  /**
   * New Members
   */
  | { type: "SET_NEW_PATIENT_CONDITIONS"; conditions: Layer[] }
  | { type: "SET_NEW_PATIENT_STATE"; processingState: ProcessingState }
  | {
      type: "SET_NEW_PATIENT_RESULTS";
      results: SimilarityResponse | null;
    }
  /**
   * Reset
   */
  | { type: "RESET_PATIENT_STATE" }
  | { type: "RESET_CONDITION_STATE" }
  | { type: "RESET_ALL" };

export type Context = State & {
  setActiveAnalysis: React.Dispatch<State["activeAnalysis"]>;
  setActiveTab: React.Dispatch<number>;

  setConditionSearchTerm: React.Dispatch<string | null>;
  setConditionSearchData: React.Dispatch<Layer | null>;
  setConditionSearchState: React.Dispatch<ProcessingState>;
  setConditionSearchResults: React.Dispatch<ConditionsResponse | null>;

  setExistingPatientSearchTerm: React.Dispatch<string | null>;
  setExistingPatientSearchState: React.Dispatch<ProcessingState>;
  setExistingPatientSearchResults: React.Dispatch<SimilarityResponse | null>;

  setNewPatientSearchConditions: React.Dispatch<Layer[]>;
  setNewPatientSearchState: React.Dispatch<ProcessingState>;
  setNewPatientSearchResults: React.Dispatch<SimilarityResponse | null>;

  resetPatientState: React.Dispatch<null>;
  resetConditionState: React.Dispatch<null>;
  resetState: React.Dispatch<null>;
};
