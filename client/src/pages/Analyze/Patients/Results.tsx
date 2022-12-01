import { useContext, useState } from "react";
import { Badge, Button, Col, Row, Table } from "reactstrap";
import { GrPowerReset } from "react-icons/gr";
import Avatar from "../../../components/PatientAvatar";
import {
  LayerNumber,
  LAYER_NAMES_ADVERBS,
  LAYER_NAMES_SHORT,
  LAYER_NAMES_SHORT_LOWER,
  M,
} from "../../../layers";
import {
  LayerFrequencies,
  SimilarityResponse,
  SimilarPatient,
} from "../../../services/api/types";
import { StateContext } from "../../../state/Provider";

import "./Results.css";

const FrequencyTable: React.FC<{
  frequencies: LayerFrequencies;
  overflow: boolean;
  precision?: number;
}> = ({ frequencies, overflow = false, precision = 2 }) => {
  return (
    <div className={overflow ? "layer-frequency-table-wrapper" : undefined}>
      <Table size="sm" hover>
        <tbody>
          {frequencies.map((_) => (
            <tr key={`layer-frequency-${_}`}>
              <td
                className="align-top py-1"
                style={{
                  width: "10%",
                }}
              >
                <span>
                  <Badge color="dark">{M[_[0]].displayCode}</Badge>
                </span>
              </td>
              <td className="py-1">{M[_[0]].description}</td>
              <td className="text-muted-more text-end pe-1 py-1">
                {_[1].toFixed(precision)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const Similarity: React.FC<{ results: SimilarityResponse }> = ({ results }) => {
  const [patient, setPatient] = useState<SimilarPatient | null>(null);
  const [currentLayer, setCurrentLayer] = useState<LayerNumber | null>(null);

  const handleSelection = (patient: SimilarPatient, layer: LayerNumber) => {
    setPatient(patient);
    setCurrentLayer(layer);
  };

  return (
    <>
      <h3>
        This patient is <span className="fw-800">similar</span>{" "}
        <span className="fw-600">to these other patients</span>{" "}
      </h3>

      <p>
        {" "}
        <span className="text-muted fw-300">
          Click any patient avatar to see each patient's conditions. We'll only
          show you the{" "}
          <span className="fw-600">five most similar patients</span> at each
          layer of specificity The numbers under each avatar denote how similar
          Member {results.thisPatient?.id.toString()} is to other patients on a
          continuous scale of zero (not similar at all) to one (is the same
          person). The rightmost column shows how many times we observed the
          condition for the given patient in our dataset.
        </span>
      </p>

      {[3, 2, 1].map((layerNumber, i) => (
        <div
          key={`similarity-row-${layerNumber}`}
          className={`${i !== 0 ? "pt-4" : "pt-3"} ${
            i + 1 !== 3 ? "border-bottom" : ""
          }`}
        >
          <Row>
            <Col sm={2} className="d-flex align-items-center">
              <h4 className="text-left fw-600">
                {LAYER_NAMES_ADVERBS[layerNumber]}
              </h4>
            </Col>
            <Col>
              <div className="results-patients">
                {results.similarPatients![layerNumber as LayerNumber].map(
                  (p) => (
                    <div
                      className={`results-patient-avatar-wrapper ${
                        patient &&
                        currentLayer &&
                        patient.id === p.id &&
                        currentLayer === layerNumber
                          ? "active-similar-patient"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelection(p, layerNumber as LayerNumber)
                      }
                    >
                      <Avatar seed={p.id} />
                      <p className="text-center">
                        Member {p.id}
                        <br />
                        <small className="text-muted">
                          {p.score.toFixed(4)}
                        </small>
                      </p>
                    </div>
                  )
                )}
              </div>
            </Col>
            {patient !== null && currentLayer === layerNumber && (
              <Row className="my-2">
                <Col
                  sm={{
                    size: 10,
                    offset: 2,
                  }}
                >
                  <FrequencyTable
                    frequencies={patient.layerInfo}
                    precision={0}
                    overflow
                  />
                </Col>
              </Row>
            )}
          </Row>
        </div>
      ))}
    </>
  );
};

const Component: React.FC<{
  results: SimilarityResponse;
  seed?: string;
  classifyDiseaseClasses?: boolean;
}> = ({ results, seed, classifyDiseaseClasses = true }) => {
  const [shownLayer, setShownLayer] = useState<LayerNumber | null>(1);
  const { resetPatientState } = useContext(StateContext)!;

  const l1 = results.thisPatient!.layerInfo[1];
  const l2 = results.thisPatient!.layerInfo[2];
  const l3 = results.thisPatient!.layerInfo[3];

  const l1_l = results.thisPatient!.layerInfo[1].length;
  const l2_l = results.thisPatient!.layerInfo[2].length;
  const l3_l = results.thisPatient!.layerInfo[3].length;

  return (
    <div className="results">
      <Row>
        <Col xs={2}>
          <Avatar seed={seed || results.thisPatient!.id.toString()} />
          <h5 className="text-center mt-2">
            Member {results.thisPatient!.id.toString()}
          </h5>
          <div className="text-center">
            <Button
              color="warning py-0 px-1"
              onClick={() => resetPatientState(null)}
            >
              <GrPowerReset className="icon" />{" "}
              <span className="fw-600">New Search</span>
            </Button>
          </div>
        </Col>
        <Col>
          <h3>
            {/* TODO: This junk is a freaking mess. Spaghetti shit. */}
            {classifyDiseaseClasses === true && (
              <span>
                This patient has{" "}
                <span
                  className={`${
                    shownLayer === 1 ? "fw-800 condition-shown" : "fw-600"
                  }`}
                >
                  <u onClick={() => setShownLayer(shownLayer === 1 ? null : 1)}>
                    {l1_l} {LAYER_NAMES_SHORT[1]}
                  </u>
                </span>{" "}
                condition
                {l1_l > 1 || l1_l === 0 ? "s" : ""},{" "}
                <span
                  className={`${
                    shownLayer === 2 ? "fw-800 condition-shown" : "fw-600"
                  }`}
                >
                  <u onClick={() => setShownLayer(shownLayer === 2 ? null : 2)}>
                    {l2_l} {LAYER_NAMES_SHORT[2]}
                  </u>
                </span>{" "}
                condition
                {l2_l > 1 || l2_l === 0 ? "s" : ""}, and{" "}
                <span
                  className={`${
                    shownLayer === 3 ? "fw-800 condition-shown" : "fw-600"
                  }`}
                >
                  <u onClick={() => setShownLayer(shownLayer === 3 ? null : 3)}>
                    {l3_l} {LAYER_NAMES_SHORT[3]}
                  </u>
                </span>{" "}
                condition
                {l3_l > 1 || l3_l === 0 ? "s" : ""}.
              </span>
            )}
            {!classifyDiseaseClasses && (
              <span>
                This patient{" "}
                <span className="fw-400">
                  {l1_l === 0
                    ? `does not have ${LAYER_NAMES_SHORT_LOWER[1]}`
                    : `${l1_l} ${LAYER_NAMES_SHORT_LOWER[1]}`}
                  {` condition${l1_l > 1 || l1_l === 0 ? "s" : ""}`}
                </span>{" "}
                {l1_l > 0 && (
                  <span>
                    {" "}
                    (
                    {l1
                      .map<React.ReactNode>((_) => (
                        <span className="fw-600">
                          {M[_[0]].description}{" "}
                          <Badge
                            color="dark"
                            className="py-1 px-1 smaller-badge"
                          >
                            {M[_[0]].displayCode}
                          </Badge>
                        </span>
                      ))
                      .reduce((prev, curr, i, arr) => {
                        if (i !== arr.length - 1) {
                          return [prev, `, `, curr];
                        } else if (i === 1) {
                          return [prev, ` and `, curr];
                        } else {
                          return [prev, `, and `, curr];
                        }
                      })}
                    )
                  </span>
                )}
                , has{" "}
                <span className="fw-400">
                  {l2_l === 0
                    ? `no ${LAYER_NAMES_SHORT_LOWER[2]}`
                    : `${l2_l} ${LAYER_NAMES_SHORT_LOWER[2]}`}
                  {` condition${l2_l > 2 || l2_l === 0 ? "s" : ""}`}
                </span>
                {l2_l > 0 && (
                  <span>
                    {" "}
                    (
                    {l2
                      .map<React.ReactNode>((_) => (
                        <span className="fw-600">
                          {M[_[0]].description}{" "}
                          <Badge
                            color="dark"
                            className="py-1 px-1 smaller-badge"
                          >
                            {M[_[0]].displayCode}
                          </Badge>
                        </span>
                      ))
                      .reduce((prev, curr, i, arr) => {
                        if (i !== arr.length - 1) {
                          return [prev, `, `, curr];
                        } else if (i === 1) {
                          return [prev, ` and `, curr];
                        } else {
                          return [prev, `, and `, curr];
                        }
                      })}
                    )
                  </span>
                )}
                , and has{" "}
                <span className="fw-400">
                  {l3_l === 0
                    ? `no ${LAYER_NAMES_SHORT_LOWER[3]}`
                    : `${l3_l} ${LAYER_NAMES_SHORT_LOWER[3]}`}
                  {` condition${l3_l > 1 || l3_l === 0 ? "s" : ""}`}
                </span>
                {l3_l > 0 && (
                  <span>
                    {" "}
                    (
                    {l3
                      .map<React.ReactNode>((_) => (
                        <span className="fw-600">
                          {M[_[0]].description}{" "}
                          <Badge
                            color="dark"
                            className="py-1 px-1 smaller-badge"
                          >
                            {M[_[0]].displayCode}
                          </Badge>
                        </span>
                      ))
                      .reduce((prev, curr, i, arr) => {
                        if (i !== arr.length - 1) {
                          return [prev, `, `, curr];
                        } else if (i === 1) {
                          return [prev, ` and `, curr];
                        } else {
                          return [prev, `, and `, curr];
                        }
                      })}
                    )
                  </span>
                )}
              </span>
            )}
          </h3>
          {classifyDiseaseClasses === true && shownLayer && (
            <div className="mt-4 mb-2">
              <FrequencyTable
                frequencies={results.thisPatient!.layerInfo[shownLayer]}
                precision={0}
                overflow
              />
            </div>
          )}
        </Col>
      </Row>
      <hr className="pt-1" />
      <Row>
        <Col>
          <Similarity results={results} />
        </Col>
      </Row>
      <hr className="pt-1" />
      <Row>
        <h3>
          This patient has <span className="fw-800">a greater potential</span>{" "}
          <span className="fw-600">of developing the following conditions</span>
        </h3>

        <p className="text-muted fw-300">
          We're showing you our model's disease predictions for this patient at
          each level of specificity. We're ranking predictions at each level by
          what our model thinks will be the{" "}
          <span className="fw-600">frequency of observation</span>. This is
          based on the <span className="fw-600">neighborhood</span> of patients
          who are similar to this patient, whom you can see above.
        </p>

        {[3, 2, 1].map((layerNumber, i) => (
          <div
            key={`expected-conditions-row-${layerNumber}`}
            className={`${i !== 0 ? "pt-3" : ""} ${
              i + 1 !== 3 ? "border-bottom" : ""
            }`}
          >
            <Row>
              <Col sm={2} className="d-flex align-items-center">
                <h4 className="text-left fw-600">
                  {LAYER_NAMES_ADVERBS[layerNumber]}
                </h4>
              </Col>
              <Col>
                <FrequencyTable
                  frequencies={
                    results.recommendedConditions![layerNumber as LayerNumber]
                  }
                  overflow={false}
                />
              </Col>
            </Row>
          </div>
        ))}
      </Row>
    </div>
  );
};

export default Component;
