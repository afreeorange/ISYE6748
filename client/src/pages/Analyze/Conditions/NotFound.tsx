import { GrPowerReset } from "react-icons/gr";
import { TbMoodSad } from "react-icons/tb";
import { Row, Col, Button } from "reactstrap";

const Component: React.FC<{
  resetHandler: () => unknown;
}> = ({ resetHandler }) => (
  <>
    <Row className="mt-4">
      <Col sm={1}>
        <TbMoodSad className="icon w-100 h-75" />
      </Col>
      <Col>
        <h3>
          We&#8217;re sorry but there was insufficient data about this condition
          to make predictions. Please try a new search.
        </h3>
      </Col>
    </Row>
    <Row>
      <Col>
        <Button
          color="warning"
          className="py-1 mt-2"
          size="lg w-100"
          onClick={resetHandler}
        >
          <GrPowerReset className="icon" /> <strong>Try Another Search</strong>
        </Button>
      </Col>
    </Row>
  </>
);

export default Component;
