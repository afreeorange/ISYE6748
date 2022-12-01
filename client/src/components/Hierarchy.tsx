import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { VscListTree } from "react-icons/vsc";
import { Row, Col, Badge } from "reactstrap";
import { Layer, M, LAYER_NAMES, LNSi } from "../layers";

import "./Hierarchy.css";

const One: React.FC<{
  condition: Layer;
}> = ({ condition }) => (
  <div>
    <Row>
      <Col className="fw-600">{condition.description}</Col>
      <Col lg={1}>
        <div className="d-flex justify-content-end">
          <Badge color="dark">{condition.displayCode}</Badge>
        </div>
      </Col>
    </Row>
    {condition.children.map((_) => (
      <Row className="hierarchy-no-highlight fw-300">
        <Col>
          <MdOutlineSubdirectoryArrowRight style={{ marginLeft: "1em" }} />{" "}
          {M[_].description}
        </Col>
        <Col lg={1}>
          <div className="d-flex justify-content-end">
            <Badge color="dark">{M[_].displayCode}</Badge>
          </div>
        </Col>
      </Row>
    ))}
  </div>
);

const Two: React.FC<{
  condition: Layer;
}> = ({ condition }) => (
  <div>
    <Row className="hierarchy-no-highlight fw-300">
      <Col>{M[condition.hierarchy[1]].description}</Col>
      <Col lg={1}>
        <div className="d-flex justify-content-end">
          <Badge color="dark">{M[condition.hierarchy[1]].displayCode}</Badge>
        </div>
      </Col>
    </Row>
    <Row>
      <Col className="fw-600">
        <MdOutlineSubdirectoryArrowRight style={{ marginLeft: "1em" }} />{" "}
        {condition.description}
      </Col>
      <Col lg={1}>
        <div className="d-flex justify-content-end">
          <Badge color="dark">{condition.displayCode}</Badge>
        </div>
      </Col>
    </Row>
    {condition.children.map((_) => (
      <Row className="hierarchy-no-highlight fw-300">
        <Col>
          <MdOutlineSubdirectoryArrowRight style={{ marginLeft: "2.5em" }} />{" "}
          {M[_].description}
        </Col>
        <Col lg={1}>
          <div className="d-flex justify-content-end">
            <Badge color="dark">{M[_].displayCode}</Badge>
          </div>
        </Col>
      </Row>
    ))}
  </div>
);

const Three: React.FC<{
  condition: Layer;
}> = ({ condition }) => (
  <div>
    <Row className="hierarchy-no-highlight fw-300">
      <Col>{M[condition.hierarchy[2]].description}</Col>
      <Col lg={1}>
        <div className="d-flex justify-content-end">
          <Badge color="dark">{M[condition.hierarchy[2]].displayCode}</Badge>
        </div>
      </Col>
    </Row>
    <Row className="hierarchy-no-highlight fw-300">
      <Col>
        <MdOutlineSubdirectoryArrowRight style={{ marginLeft: "1em" }} />
        {M[condition.hierarchy[1]].description}
      </Col>
      <Col lg={1}>
        <div className="d-flex justify-content-end">
          <Badge color="dark">{M[condition.hierarchy[1]].displayCode}</Badge>
        </div>
      </Col>
    </Row>
    {M[condition.hierarchy[1]].children.map((_) => (
      <Row
        className={
          M[_].code === condition.code
            ? "fw-600"
            : "hierarchy-no-highlight fw-300"
        }
        key={`three-hierarchy-${_}`}
      >
        <Col>
          <MdOutlineSubdirectoryArrowRight style={{ marginLeft: "2.5em" }} />{" "}
          {M[_].description}
        </Col>
        <Col lg={1}>
          <div className="d-flex justify-content-end">
            <Badge color="dark">{M[_].displayCode}</Badge>
          </div>
        </Col>
      </Row>
    ))}
  </div>
);

const countChildConditions = (code: string) =>
  M[code].children
    .map((_) => M[_].children)
    .reduce((total, _) => total + _.length, 0);

const ConditionHierarchy: React.FC<{
  condition: Layer;
}> = ({ condition }) => (
  <div className="condition-hierarchy">
    <h3 className="fw-600">
      <VscListTree /> Condition Hierarchy
    </h3>
    <div>
      <p>
        You picked a <strong>{LNSi[condition.layer]}</strong>.{" "}
        {condition.layer === 1 && (
          <span>
            It encompasses{" "}
            <span className="fw-600">
              {M[condition.code].children.length} {LAYER_NAMES[2]}
            </span>{" "}
            and{" "}
            <span className="fw-600">
              {countChildConditions(condition.code)} {LAYER_NAMES[3]}
            </span>
            . Here are the broad conditions.
          </span>
        )}
        {condition.layer === 2 && (
          <span>
            It is part of a{" "}
            <span className="fw-600">
              {LNSi[1]} called &#8220;
              {M[condition.hierarchy[1]].description}
              &#8221;
            </span>
            and encompasses{" "}
            <span className="fw-600">
              {condition.children.length} {LAYER_NAMES[3]}
            </span>
            . Here's a hierarchy.
          </span>
        )}
        {condition.layer === 3 && (
          <span>
            It is part of a{" "}
            <span className="fw-600">
              {LNSi[2]} of &#8220;
              {M[condition.hierarchy[2]].description}
              &#8221;
            </span>{" "}
            and a{" "}
            <span className="fw-600">
              {LNSi[1]} of &#8220;
              {M[condition.hierarchy[1]].description}
              &#8221;
            </span>
            . Here's a hierarchy.
          </span>
        )}
      </p>
      {condition.layer === 1 && <One condition={condition} />}
      {condition.layer === 2 && <Two condition={condition} />}
      {condition.layer === 3 && <Three condition={condition} />}
    </div>
  </div>
);

export default ConditionHierarchy;
