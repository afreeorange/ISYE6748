import {
  initialConditionState,
  initialPatientState,
  initialState,
} from "./initial";
import { State, Action } from "./types";

const reducer = (state: State, action: Action): State => {
  if (action.type === "SET_ANALYSIS_TYPE") {
    return {
      ...state,
      activeAnalysis: action.analysisType,
    };
  }

  if (action.type === "SET_ACTIVE_TAB") {
    return {
      ...state,
      activeTab: action.tab,
    };
  }

  /**
   * --------- Conditions ---------
   */
  if (action.type === "SET_CONDITION_SEARCH_TERM") {
    return {
      ...state,
      conditionSearchTerm: action.term,
    };
  }
  if (action.type === "SET_CONDITION_SEARCH_DATA") {
    return {
      ...state,
      conditionSearchData: action.layer,
    };
  }
  if (action.type === "SET_CONDITION_SEARCH_STATE") {
    return {
      ...state,
      processingState: action.processingState,
      conditionSearchState: action.processingState,
    };
  }
  if (action.type === "SET_CONDITION_SEARCH_RESULTS") {
    return {
      ...state,
      conditionSearchResults: action.results,
    };
  }

  /**
   * --------- Existing Members ---------
   */
  if (action.type === "SET_EXISTING_PATIENT_SEARCH_TERM") {
    return {
      ...state,
      existingPatientSearchTerm: action.term,
    };
  }
  if (action.type === "SET_EXISTING_PATIENT_STATE") {
    return {
      ...state,
      processingState: action.processingState,
      existingPatientSearchState: action.processingState,
    };
  }
  if (action.type === "SET_EXISTING_PATIENT_RESULTS") {
    return {
      ...state,
      existingPatientSearchResults: action.results,
    };
  }

  /**
   * --------- New Members ---------
   */
  if (action.type === "SET_NEW_PATIENT_CONDITIONS") {
    return {
      ...state,
      newPatientConditions: action.conditions,
    };
  }

  if (action.type === "SET_NEW_PATIENT_STATE") {
    return {
      ...state,
      processingState: action.processingState,
      newPatientSearchState: action.processingState,
    };
  }

  if (action.type === "SET_NEW_PATIENT_RESULTS") {
    return {
      ...state,
      newPatientSearchResults: action.results,
    };
  }

  /**
   * --------- Resetting Things ---------
   */

  if (action.type === "RESET_CONDITION_STATE") {
    return {
      ...state,
      ...initialConditionState,
      activeAnalysis: "__conditions",
    };
  }

  if (action.type === "RESET_PATIENT_STATE") {
    return {
      ...state,
      ...initialPatientState.existing,
      ...initialPatientState.new,
      activeAnalysis: "__patients",
    };
  }

  if (action.type === "RESET_ALL") {
    return initialState;
  }

  return state;
};

export default reducer;
