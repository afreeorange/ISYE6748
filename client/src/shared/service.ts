import { PatientData, RelatedConditionsData } from "../data";
import { MOCK_PATIENT_DATA, MOCK_SIMILAR_CONDITIONS } from "../data/sample";
import { processSimilarityResponse, simulateLatency } from "./helpers";

/**
 * When calling the 'real' upstream source, you would smush the results of
 * two endpoints (the first is faster than the second).
 *
 * - /api/similar_patients/{id}?limit=5
 * - /api/patient_conditions/{id}
 */
export const getPatient = async (
  id: string,
  mock: boolean = false
): Promise<PatientData> => {
  if (mock) {
    await simulateLatency();

    return processSimilarityResponse({
      ...MOCK_PATIENT_DATA,
      thisPatient: {
        ...MOCK_PATIENT_DATA.thisPatient,
        id,
      },
    });
  }

  const similarPatients = processSimilarityResponse(
    await (await fetch(`/api/similar_patients/${id}?limit=${5}`)).json()
  );

  const patientConditions = await (
    await fetch(`/api/patient_conditions/${id}?limit=${5}`)
  ).json();

  return {
    ...similarPatients,
    conditions: patientConditions,
  };
};

/**
 * This is really a user-experience demo, so we'd call
 *
 * - /api/random_member_id
 *
 * and feed that to:
 *
 * - /api/similar_patients/{id}?limit=5
 * - /api/patient_conditions/{id}
 */
export const getNewPatient = async (
  conditions: string[],
  mock: boolean = false
): Promise<PatientData> => {
  console.log(`Received conditions: ${conditions}`);

  if (mock) {
    await simulateLatency();

    return processSimilarityResponse({
      ...MOCK_PATIENT_DATA,
      thisPatient: {
        ...MOCK_PATIENT_DATA.thisPatient,
        id: "999999",
      },
    });
  }

  const { memberLifeId: id } = await (
    await fetch(`/api/random_member_id`)
  ).json();

  const similarPatients = processSimilarityResponse(
    await (await fetch(`/api/similar_patients/${id}?limit=${5}`)).json()
  );

  const patientConditions = await (
    await fetch(`/api/patient_conditions/${id}?limit=${5}`)
  ).json();

  return {
    ...similarPatients,
    conditions: patientConditions,
  };
};

/**
 * This would call
 *
 * - /api/similar_conditions/{code}
 */
export const getConditions = async (
  code: string,
  mock: boolean = false
): Promise<RelatedConditionsData> => {
  if (mock) {
    await simulateLatency();

    return MOCK_SIMILAR_CONDITIONS;
  }

  /**
   * TODO: 404s.
   */
  return await (await fetch(`/api/similar_conditions/${code}`)).json();
};
