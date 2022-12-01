import { useContext } from "react";
import { TbMoodSad } from "react-icons/tb";
import { GrPowerReset } from "react-icons/gr";
import { Button, Col, Row } from "reactstrap";

import { StateContext } from "../../../state/Provider";

const Component: React.FC<{
  /**
   * The member WAS found but the similarity matrices did not contain enough
   * information to show predictions...
   */
  insufficientData?: boolean;
}> = ({ insufficientData = false }) => {
  const { resetPatientState, setActiveAnalysis } = useContext(StateContext)!;

  return (
    <div className="my-4">
      <Row>
        <Col sm={1}>
          <TbMoodSad className="icon w-100 h-75" />
        </Col>
        <Col>
          <h3>
            {!insufficientData
              ? "Sorry, we could not find a patient with that Member Life ID"
              : "Sorry, there was insufficient data about this member to make predictions"}{" "}
          </h3>
        </Col>
      </Row>
      <Button
        color="warning"
        className="py-1 mt-4"
        size="lg w-100"
        onClick={() => {
          resetPatientState(null);
          setActiveAnalysis("__patients_existing");
        }}
      >
        <GrPowerReset className="icon" /> <strong>Try Another ID</strong>
      </Button>
    </div>
  );
};

export default Component;
