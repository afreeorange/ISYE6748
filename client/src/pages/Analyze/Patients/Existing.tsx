import { useContext } from "react";
import { Row, Col } from "reactstrap";

import MemberSearchBox from "../../../components/MemberSearchBox";
import Avatar from "../../../components/PatientAvatar";
import UpstreamError from "../../../components/UpstreamError";
import { StateContext } from "../../../state/Provider";
import NotFound from "./NotFound";
import Results from "./Results";

const Component: React.FC = () => {
  const {
    existingPatientSearchTerm,
    existingPatientSearchResults,
    existingPatientSearchState,
    resetPatientState,
    setActiveAnalysis,
  } = useContext(StateContext)!;

  return (
    <Row className="mt-4">
      {existingPatientSearchState !== "processed" && (
        <Col xs={2}>
          <Avatar seed={existingPatientSearchTerm || "0"} />
        </Col>
      )}

      {/* TODO: THIS IS COPYPASTA. I could not figure out the logical thing to do here... */}
      {existingPatientSearchState === "processed" &&
        existingPatientSearchResults === null && (
          <Col xs={2}>
            <Avatar seed={existingPatientSearchTerm || "0"} />
          </Col>
        )}

      <Col>
        {existingPatientSearchState !== "processed" && (
          <h2>
            I want to <span className="fw-600">examine the journey</span> of a{" "}
            <span className="fw-800">known patient</span> with a{" "}
            <span
              className={`fw-800 ${
                !existingPatientSearchTerm ? " text-muted-more" : ""
              }`}
            >
              Member Life ID {existingPatientSearchTerm || "...?"}
            </span>{" "}
          </h2>
        )}
        {existingPatientSearchState === "idle" && <MemberSearchBox />}

        {existingPatientSearchState === "error" &&
          existingPatientSearchResults === null && (
            <UpstreamError
              onButtonClick={() => {
                resetPatientState(null);
                setActiveAnalysis("__patients_existing");
              }}
            />
          )}

        {existingPatientSearchState === "error" &&
          existingPatientSearchResults !== null && (
            <NotFound insufficientData />
          )}

        {/* TODO: THIS IS COPYPASTA. I could not figure out the logical thing to do here... */}
        {existingPatientSearchState === "processed" &&
          existingPatientSearchResults === null && (
            <>
              <h2>
                I want to <span className="fw-600">examine the journey</span> of
                a <span className="fw-800">known patient</span> with a{" "}
                <span
                  className={`fw-800 ${
                    !existingPatientSearchTerm ? " text-muted-more" : ""
                  }`}
                >
                  Member Life ID {existingPatientSearchTerm || "...?"}
                </span>{" "}
              </h2>
              <NotFound />
            </>
          )}
        {existingPatientSearchState === "processed" &&
          existingPatientSearchResults !== null && (
            <Results results={existingPatientSearchResults} />
          )}
      </Col>
    </Row>
  );
};

export default Component;
