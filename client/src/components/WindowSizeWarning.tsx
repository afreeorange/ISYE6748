import { Alert, Col, Row } from "reactstrap";
import { TbArrowAutofitWidth } from "react-icons/tb";
import { useWindowWidth } from "@react-hook/window-size";

const MIN_WIDTH_IN_PIXELS = 1000;

const Component: React.FC = () => {
  const windowWidth = useWindowWidth();

  if (windowWidth < MIN_WIDTH_IN_PIXELS) {
    return (
      <Alert
        color="danger"
        className="border-top-0 border-end-0 border-start-0 border-3 mb-0"
      >
        <Row>
          {windowWidth >= 675 && (
            <Col sm={1} className="align-top">
              <TbArrowAutofitWidth style={{ fontSize: "3rem" }} />
            </Col>
          )}
          <Col>
            <h5>
              We&#8217;re really sorry but we haven't yet gotten to optimizing
              this site's experience for mobile devices or screen widths lower
              than ~<strong>{MIN_WIDTH_IN_PIXELS}px</strong> (you're at{" "}
              <strong className="fw-600">{windowWidth}px</strong>). Please try
              this site out on your desktop, laptop, or a tablet.
            </h5>
          </Col>
        </Row>
      </Alert>
    );
  }

  return null;
};

export default Component;
