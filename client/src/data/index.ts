import { LayerClass, LayerFrequencies, LayerNumber } from "./layers";

export type PredictionTuple = [LayerClass, number];

export type PatientData = {
  thisPatient: { id: string; layerInfo: Record<LayerNumber, LayerFrequencies> };
  score?: number;
  similarPatients: Record<
    LayerNumber,
    {
      id: string;
      layerInfo: PredictionTuple[];
      score: number;
    }[]
  >;
  conditions: Record<LayerNumber, LayerFrequencies>;
};

export type RelatedConditionsData = Record<LayerNumber, PredictionTuple[]>;
