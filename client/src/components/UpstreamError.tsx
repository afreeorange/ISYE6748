import { TbMoodSad } from "react-icons/tb";
import { GrPowerReset } from "react-icons/gr";
import { Button, Col, Row } from "reactstrap";

const Component: React.FC<{
  onButtonClick: () => unknown;
}> = ({ onButtonClick }) => {
  return (
    <>
      <Row>
        <Col sm={1}>
          <TbMoodSad className="icon w-100 h-75 text-danger" />
        </Col>
        <Col>
          <h3 className="text-danger">
            We&#8217;re really sorry, something bad happened on our server when
            we tried to process your request.
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            color="warning"
            className="mt-4 py-2"
            size="lg w-100"
            onClick={onButtonClick}
          >
            <GrPowerReset className="icon" /> <strong>Try a new search</strong>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Component;
