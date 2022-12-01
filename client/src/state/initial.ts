import {
  ConditionState,
  ExistingPatientState,
  NewPatientState,
  State,
} from "./types";

export const initialConditionState: ConditionState = {
  conditionSearchTerm: null,
  conditionSearchData: null,
  conditionSearchState: "idle",
  conditionSearchResults: null,
};

export const initialPatientState: {
  existing: ExistingPatientState;
  new: NewPatientState;
} = {
  existing: {
    existingPatientSearchTerm: null,
    existingPatientSearchState: "idle",
    existingPatientSearchResults: null,
  },
  new: {
    newPatientConditions: [],
    newPatientSearchState: "idle",
    newPatientSearchResults: null,
  },
};

export const initialState: State = {
  activeAnalysis: null,
  activeTab: 0,
  preventedLawsuits: false,
  processingState: "idle",
  ...initialConditionState,
  ...initialPatientState.existing,
  ...initialPatientState.new,
};
