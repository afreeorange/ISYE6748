import { useContext } from "react";
import { ImPointRight, ImLab } from "react-icons/im";
import { Alert, Button, Col, Row, Spinner } from "reactstrap";
import ConditionSearchBox from "../../../components/ConditionSearchBox";
import Avatar from "../../../components/PatientAvatar";
import { L } from "../../../layers";
import { StateContext } from "../../../state/Provider";
import services from "../../../services/api";
import Results from "./Results";
import UpstreamError from "../../../components/UpstreamError";

import "./New.css";

const BuildABear: React.FC = () => {
  const {
    newPatientConditions,
    newPatientSearchState,
    newPatientSearchResults,
    setNewPatientSearchConditions,
    setNewPatientSearchResults,
    setNewPatientSearchState,
  } = useContext(StateContext)!;

  const handleSelection = (indices: number[]) => {
    setNewPatientSearchConditions(indices.map((_) => L[_]));
  };

  const handleSubmit = async () => {
    setNewPatientSearchState("processing");

    try {
      setNewPatientSearchResults(
        await services.patient.new.processProfile(
          newPatientConditions.map((_) => _.code)
        )
      );

      setNewPatientSearchState("processed");
    } catch (e) {
      setNewPatientSearchState("error");
    }
  };

  const handleReset = () => {
    setNewPatientSearchConditions([]);
    setNewPatientSearchState("idle");
    setNewPatientSearchResults(null);
  };

  return (
    <Row>
      <Col xs={2}>
        <Avatar
          seed={newPatientConditions.map((_) => _.code).join("") || "0"}
        />
        {newPatientSearchState === "processed" && (
          <h5 className="text-center mt-2">
            Member {newPatientSearchResults?.thisPatient?.id}
          </h5>
        )}
      </Col>
      <Col>
        <h2>
          I want to <span className="fw-600">examine the journey</span> of an{" "}
          <span className="fw-800">new patient</span> with{" "}
          {newPatientConditions.length === 0 ? (
            <span>
              a profile I will create.{" "}
              <span className="text-muted-more fw-300">
                Use the search box below to add{" "}
                <span className="fw-600">up to five conditions</span> to this
                new patient's profile.{" "}
              </span>
            </span>
          ) : (
            <span>
              {newPatientConditions
                .map<React.ReactNode>((_) => (
                  <span className="fw-600 new-patient-condition">
                    {_.description}
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
            </span>
          )}
        </h2>

        {newPatientConditions.length > 0 &&
          newPatientSearchState !== "processed" && (
            <Row className="mb-2 mt-4">
              <Col>
                <Button
                  color="success"
                  className="w-100"
                  onClick={() => handleSubmit()}
                  onMouseEnter={() =>
                    document
                      .querySelector(".condition-search-box")
                      ?.classList.add("blur-things")
                  }
                  onMouseLeave={() =>
                    document
                      .querySelector(".condition-search-box")
                      ?.classList.remove("blur-things")
                  }
                >
                  {newPatientSearchState === "processing" ? (
                    <Spinner size={"sm"} />
                  ) : (
                    <span>
                      <ImLab className="icon" />{" "}
                      <strong>Examine Journey</strong>
                    </span>
                  )}
                </Button>
              </Col>
            </Row>
          )}

        {newPatientSearchState === "idle" && (
          <ConditionSearchBox
            limitSelectionTo={5}
            selectionCallback={({ checkedIndices }) =>
              handleSelection(checkedIndices)
            }
            resetCallback={() => handleReset()}
          />
        )}
      </Col>
    </Row>
  );
};

const Component: React.FC = () => {
  const {
    newPatientConditions,
    newPatientSearchState,
    newPatientSearchResults,
    resetPatientState,
    setActiveAnalysis,
  } = useContext(StateContext)!;

  return (
    <>
      <Alert color="danger" className="mt-3">
        <ImPointRight className="icon" /> This feature is a{" "}
        <span className="fw-600">user-experience experiment</span>, is{" "}
        <span className="fw-600">unfinished</span>, and will display journey of
        a randomly chosen member. Please{" "}
        <a href="/Report.pdf" className="link-danger">
          read our report
        </a>{" "}
        for more information on the challenges of implementing this feature.{" "}
        <span className="fw-600"> We do hope to make it work well in the future</span>. In the
        meantime, please enjoy playing around with our proposed interface!
      </Alert>

      {newPatientSearchState === "idle" && <BuildABear />}

      {newPatientSearchState === "error" &&
        newPatientSearchResults === null && (
          <UpstreamError
            onButtonClick={() => {
              resetPatientState(null);
              setActiveAnalysis("__patients_new");
            }}
          />
        )}

      {newPatientSearchState === "processed" &&
        newPatientSearchResults !== null && (
          <Row>
            <Col>
              <Results
                seed={newPatientConditions.map((_) => _.code).join("")}
                classifyDiseaseClasses={false}
                results={newPatientSearchResults}
              />
            </Col>
          </Row>
        )}
    </>
  );
};

export default Component;
