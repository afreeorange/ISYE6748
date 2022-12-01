import axios from "axios";
import {
  ConditionsResponse,
  LayerFrequencies,
  RandomMemberIdResponse,
  SimilarityResponse,
} from "./types";
import { LayerClass, LayerNumber, M } from "../../layers";

const MAX_ITEM_RESULTS = 5;

export const conditionService = {
  similarTo: async (condition: string): Promise<ConditionsResponse> => {
    return (await axios.get(`/api/similar_conditions/${condition}`)).data;

    /**
     * Uncomment this stuff to mock responses locally (if you need to).
     */
    // return new Promise((resolve, reject) =>
    //   setTimeout(() => resolve(MockConditions as ConditionsResponse), 1000)
    // );
  },
};

export const patientService = {
  existing: {
    similarTo: async (memberLifeId: string): Promise<SimilarityResponse> => {
      const call_1 = processSimilarityResponse(
        (
          await axios.get(
            `/api/similar_patients/${memberLifeId}?limit=${MAX_ITEM_RESULTS}`
          )
        ).data
      );

      const call_2 = (
        await axios.get(
          `/api/patient_conditions/${memberLifeId}?limit=${MAX_ITEM_RESULTS}`
        )
      ).data;

      return {
        ...call_1,
        recommendedConditions: call_2,
      };

      /**
       * Uncomment this stuff to mock responses locally (if you need to).
       */
      // return new Promise((resolve) =>
      //   setTimeout(() => {
      //     resolve(processSimilarityResponse(MockPatients as any));
      //   }, 1000)
      // );
    },
  },
  new: {
    processProfile: async (
      /**
       * We're ignoring this list since we haven't implemented this in the
       * backend yet. What we WOULD do is send a POST request with the list of
       * conditions (e.g. [B00_B99, G17, H45_55]) and return the exact response
       * shape as the existing patient call.
       */
      conditions: string[]
    ): Promise<SimilarityResponse> => {
      /**
       * Get a random member ID
       *
       */
      const call_1: RandomMemberIdResponse = (
        await axios.get(`/api/random_member_id`)
      ).data;

      /**
       * Now use it to simulate something and make the results interesting
       * instead of hard-coding a member ID and returning the same results over
       * and over again. People really like playing with creating new patient
       * profiles!
       */
      const call_2 = processSimilarityResponse(
        (
          await axios.get(
            `/api/similar_patients/${call_1.memberLifeId}?limit=${MAX_ITEM_RESULTS}`
          )
        ).data
      );

      const call_3 = (
        await axios.get(
          `/api/patient_conditions/${call_1.memberLifeId}?limit=${MAX_ITEM_RESULTS}`
        )
      ).data;

      const fakeLayerInfo: Record<LayerNumber, LayerFrequencies> = {
        "1": [],
        "2": [],
        "3": [],
      };

      conditions.forEach((c) => {
        const _ = M[c].layer;
        fakeLayerInfo[_ as LayerNumber].push([c as LayerClass, 1]);
      });

      return {
        thisPatient: {
          id: "999",
          layerInfo: fakeLayerInfo,
        },
        similarPatients: call_2.similarPatients,
        recommendedConditions: call_3,
      };
    },
  },
};

/**
 * Remove zeroes and sort by frequencies. That's all.
 */
export const processLayerFrequencies = (
  l: LayerFrequencies
): LayerFrequencies =>
  l
    .filter((_) => _[1] > 0)
    .sort((a, b) => (a[1] >= b[1] ? -1 : 1)) as LayerFrequencies;

export const processSimilarityResponse = (
  r: SimilarityResponse
): SimilarityResponse => {
  return {
    thisPatient: {
      id: r.thisPatient!.id,
      layerInfo: {
        "1": processLayerFrequencies(r.thisPatient!.layerInfo[1]),
        "2": processLayerFrequencies(r.thisPatient!.layerInfo[2]),
        "3": processLayerFrequencies(r.thisPatient!.layerInfo[3]),
      },
    },
    similarPatients: {
      "1": r.similarPatients![1].map((_) => ({
        ..._,
        layerInfo: processLayerFrequencies(_.layerInfo),
      })),
      "2": r.similarPatients![2].map((_) => ({
        ..._,
        layerInfo: processLayerFrequencies(_.layerInfo),
      })),
      "3": r.similarPatients![3].map((_) => ({
        ..._,
        layerInfo: processLayerFrequencies(_.layerInfo),
      })),
    },
    recommendedConditions: null,
  };
};

const services = {
  condition: conditionService,
  patient: patientService,
};

export default services;
