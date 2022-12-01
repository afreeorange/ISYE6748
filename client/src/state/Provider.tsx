import React, { createContext, useReducer } from "react";

import { Layer } from "../layers";
import { ConditionsResponse, SimilarityResponse } from "../services/api/types";
import { initialState } from "./initial";
import reducer from "./reducer";
import { State, ProcessingState, Context } from "./types";

export const StateContext = createContext<Context | null>(null);

const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: Context = {
    ...state,

    setConditionSearchTerm: (term: string | null) =>
      dispatch({ type: "SET_CONDITION_SEARCH_TERM", term }),
    setConditionSearchData: (layer: Layer | null) =>
      dispatch({ type: "SET_CONDITION_SEARCH_DATA", layer }),
    setConditionSearchState: (processingState: ProcessingState) =>
      dispatch({ type: "SET_CONDITION_SEARCH_STATE", processingState }),
    setConditionSearchResults: (results: ConditionsResponse | null) =>
      dispatch({ type: "SET_CONDITION_SEARCH_RESULTS", results }),

    setExistingPatientSearchTerm: (term: string | null) =>
      dispatch({ type: "SET_EXISTING_PATIENT_SEARCH_TERM", term }),
    setExistingPatientSearchState: (processingState: ProcessingState) =>
      dispatch({ type: "SET_EXISTING_PATIENT_STATE", processingState }),
    setExistingPatientSearchResults: (results: SimilarityResponse | null) =>
      dispatch({ type: "SET_EXISTING_PATIENT_RESULTS", results }),

    setNewPatientSearchConditions: (conditions: Layer[]) =>
      dispatch({ type: "SET_NEW_PATIENT_CONDITIONS", conditions }),
    setNewPatientSearchState: (processingState: ProcessingState) =>
      dispatch({ type: "SET_NEW_PATIENT_STATE", processingState }),
    setNewPatientSearchResults: (results: SimilarityResponse | null) =>
      dispatch({ type: "SET_NEW_PATIENT_RESULTS", results }),

    setActiveAnalysis: (analysisType: State["activeAnalysis"]) =>
      dispatch({ type: "SET_ANALYSIS_TYPE", analysisType }),
    setActiveTab: (tab: number) => dispatch({ type: "SET_ACTIVE_TAB", tab }),

    resetConditionState: () => dispatch({ type: "RESET_CONDITION_STATE" }),
    resetPatientState: () => dispatch({ type: "RESET_PATIENT_STATE" }),
    resetState: () => dispatch({ type: "RESET_ALL" }),
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export default StateProvider;
