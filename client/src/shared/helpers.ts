import { PatientData } from "../data";
import { LayerFrequencies } from "../data/layers";

/**
 * So I can meditate over my spinners 😵‍💫
 */
export const simulateLatency = async () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

/**
 * Remove zeroes and sort by frequencies. That's all.
 */
export const processFrequencies = (l: LayerFrequencies): LayerFrequencies =>
  l
    .filter((_) => _[1] > 0)
    .sort((a, b) => (a[1] >= b[1] ? -1 : 1)) as LayerFrequencies;

export const processSimilarityResponse = (r: PatientData): PatientData => {
  return {
    ...r,
    thisPatient: {
      id: r.thisPatient.id,
      layerInfo: {
        "1": processFrequencies(r.thisPatient.layerInfo[1]),
        "2": processFrequencies(r.thisPatient.layerInfo[2]),
        "3": processFrequencies(r.thisPatient.layerInfo[3]),
      },
    },
    similarPatients: {
      "1": r.similarPatients[1].map((_) => ({
        ..._,
        layerInfo: processFrequencies(_.layerInfo),
      })),
      "2": r.similarPatients[2].map((_) => ({
        ..._,
        layerInfo: processFrequencies(_.layerInfo),
      })),
      "3": r.similarPatients[3].map((_) => ({
        ..._,
        layerInfo: processFrequencies(_.layerInfo),
      })),
    },
  };
};
