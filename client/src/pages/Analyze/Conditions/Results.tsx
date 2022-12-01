import { Badge, Col, Row, Table } from "reactstrap";
import { M, LN, LayerNumber } from "../../../layers";
import { ConditionsResponse } from "../../../services/api/types";

import "./Results.css";

const Results: React.FC<{
  results: ConditionsResponse;
  layerNumber: LayerNumber;
}> = ({ results, layerNumber }) => {
  return (
    <div className="mt-4">
      <Row>
        <Col>
          <h4
            className={`fw-600 ${
              results[layerNumber].length === 0
                ? " text-muted border-bottom"
                : ""
            }`}
          >
            {LN[layerNumber]}
          </h4>
        </Col>
      </Row>

      {results[layerNumber].length > 0 ? (
        <Table size="sm" bordered>
          {results[layerNumber].map((_: any) => (
            <tr>
              <td>{M[_[0]].description}</td>
              <td className="text-end">
                <Badge color="dark">{M[_[0]].displayCode}</Badge>{" "}
                <span className="text-muted-more text-monospace">
                  {_[1].toFixed(4)}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <p className="text-muted">
          We could not find any results at this level of specificity
        </p>
      )}
    </div>
  );
};

const Component: React.FC<{
  results: ConditionsResponse | null;
}> = ({ results }) => {
  if (!results) {
    return (
      <h3 className="text-muted">
        We could not find any results for your query. This is a bit odd. Please{" "}
      </h3>
    );
  }

  const layerNumbers = Object.keys(results).sort().reverse();
  return (
    <div className="condition-analysis-results">
      <p className="text-muted fw-300">
        We're showing you what our model thinks are the conditions closest to
        your query at each level of specificity. The numbers on the right denote
        a <span className="fw-600">similarity score</span> a on a continuous
        scale of zero (not similar at all) to one (is the same condition).{" "}
      </p>
      {layerNumbers.map((_) => (
        <Results results={results} layerNumber={parseInt(_) as LayerNumber} />
      ))}
    </div>
  );
};

export default Component;
