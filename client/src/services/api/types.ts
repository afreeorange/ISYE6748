import { LayerNumber, LayerClass } from "../../layers";

export type ConditionsResponse = Record<LayerNumber, [string, number][]>;

export type LayerFrequencies = [LayerClass, number][];

export type ThisPatient = {
  id: string;
  layerInfo: Record<LayerNumber, LayerFrequencies>;
};

export type SimilarPatient = {
  id: string;
  score: number;
  layerInfo: LayerFrequencies;
};

/**
 * Layers are grouped individually here.
 */
export type SimilarPatients = Record<LayerNumber, SimilarPatient[]>;

export type SimilarityResponse = {
  thisPatient: ThisPatient | null;
  similarPatients: SimilarPatients | null;
  recommendedConditions: Record<LayerNumber, LayerFrequencies> | null;
};

export type RandomMemberIdResponse = {
  memberLifeId: string;
};
