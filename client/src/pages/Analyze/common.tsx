import { useState } from "react";
import { PatientData } from "../../data";
import {
  LAYER_NAME,
  LayerFrequencies,
  LayerNumber,
  M,
} from "../../data/layers";
import { ICDCode, PatientAvatar } from "../../shared/components";

export const FrequencyTable: React.FC<{
  frequencies: LayerFrequencies;
  precision?: number;
  className?: string;
}> = ({ frequencies, precision = 2, className }) => {
  return (
    <div className={`max-h-72 overflow-y-auto ${className}`}>
      <table className="frequency-table">
        <tbody>
          {frequencies.map((_) => (
            <tr key={`layer-frequency-${_}`}>
              <td>
                <ICDCode>{M[_[0]].displayCode}</ICDCode>
              </td>
              <td>{M[_[0]].description}</td>
              <td>{_[1].toFixed(precision)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const PotentialSection = ({ data }: { data: PatientData }) => (
  <section>
    <h2 className="text-3xl tracking-tight mb-4 mt-8">
      They have <strong className="font-bold">a greater potential</strong> of
      developing the following conditions.
    </h2>
    <p className="mb-6">
      We&#8217;re showing you our model&#8217;s disease predictions for this
      patient at each level of specificity. We&#8217;re ranking predictions at
      each level by what our model thinks will be the frequency of observation.
      This is based on the neighborhood of patients who are similar to this
      patient, whom you can see above.
    </p>

    {[3, 2, 1].map((layerNumber) => (
      <div
        className={`grid grid-cols-[12rem_auto] ${
          layerNumber !== 1 ? "border-b-2" : undefined
        }`}
        key={`expected-conditions-row-${layerNumber}`}
      >
        <h3 className="flex items-center font-semibold text-xl">
          {LAYER_NAME[layerNumber].adverb}
        </h3>
        <FrequencyTable
          frequencies={data!.conditions[layerNumber as LayerNumber]}
        />
      </div>
    ))}
  </section>
);

export const SimilaritySection = ({ data }: { data: PatientData }) => {
  const [similarPatient, setSimilarPatient] = useState<string | null>(null); // Note that this is a layer + ID combo! You can have the same patient at many layers.
  return (
    <section>
      <h2 className="text-3xl tracking-tight mb-4 mt-8">
        They are <strong className="font-bold">similar</strong> to these other
        patients.
      </h2>
      <p className="mb-6">
        <strong className="font-semibold">
          Click any patient avatar to see each related patient's conditions
        </strong>
        . We'll only show you the{" "}
        <strong className="font-semibold">five most similar patients</strong> at
        each level of specificity. The numbers under each avatar denote how
        similar Member {data?.thisPatient.id} is to other patients on a
        continuous scale of zero (not similar at all) to one (is the same
        person). The rightmost column shows how many times we observed the
        condition for the given patient in our dataset.
      </p>
      <div>
        {[3, 2, 1].map((layerNumber) => (
          <div
            className={`grid grid-cols-[12rem_auto] py-6 ${
              layerNumber !== 1 ? "border-b-2" : undefined
            }`}
            key={`expected-conditions-row-${layerNumber}`}
          >
            <h3 className="flex items-center font-semibold text-xl">
              {LAYER_NAME[layerNumber].adverb}
            </h3>
            <div>
              <div className="flex justify-between">
                {data!.similarPatients![layerNumber as LayerNumber].map((p) => (
                  <>
                    <div
                      onClick={() =>
                        setSimilarPatient(`${layerNumber}-${p.id}`)
                      }
                      key={`similar-patient-info-${layerNumber}-${p.id}`}
                    >
                      <PatientAvatar
                        seed={parseInt(p.id)}
                        className={`w-32 mb-4 cursor-pointer transition-all ${
                          similarPatient !== `${layerNumber}-${p.id}`
                            ? "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                            : undefined
                        }`}
                      />
                      <p className="text-center text-xs">
                        Patient {p.id}
                        <br />
                        <span className="font-mono">{p.score.toFixed(4)}</span>
                      </p>
                    </div>
                  </>
                ))}
              </div>
              {data!.similarPatients![layerNumber as LayerNumber].map((p) => (
                <FrequencyTable
                  frequencies={p.layerInfo}
                  precision={0}
                  key={`similar-patient-frequency-${layerNumber}-${p.id}`}
                  className={`${
                    similarPatient !== `${layerNumber}-${p.id}`
                      ? "hidden"
                      : "overflow-table"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
