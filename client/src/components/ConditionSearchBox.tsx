import { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import {
  Badge,
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Row,
  Table,
} from "reactstrap";
import { LNSh } from "../layers";
import { LayerSearchResults, searchICDCodesLocally } from "../services/search";

import "./ConditionSearchBox.css";

export const LAYER_SEARCH_RESULT_LIMIT = 25;

const Results: React.FC<{
  searchResults: LayerSearchResults;
  checkedIndices: number[];
  selectionSaturated?: boolean;
  callback: (indexInReference: number) => unknown;
}> = ({
  searchResults,
  checkedIndices,
  selectionSaturated = false,
  callback,
}) => {
  if (searchResults.length === 0) {
    return <></>;
  }

  return (
    <Table size="sm" hover>
      <tbody>
        {searchResults.slice(0, LAYER_SEARCH_RESULT_LIMIT).map((_) => (
          <tr
            onClick={() => {
              callback(_.refIndex);
            }}
            role="button"
            className={[
              checkedIndices.includes(_.refIndex) ? "checked-code" : "",
              selectionSaturated ? "saturated" : undefined,
            ]
              .join(" ")
              .trim()}
          >
            <td className="align-top">{_.item.description}</td>
            <td className="text-end align-top">
              <Badge color="dark">{_.item.displayCode}</Badge>
            </td>
            <td className="text-end align-top">
              <Badge color="info">{LNSh[_.item.layer]}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Component: React.FC<{
  limitSelectionTo?: number | null;
  selectionCallback: ({
    term,
    checkedIndices,
  }: {
    term: string;
    checkedIndices: number[];
  }) => unknown;
  resetCallback: () => unknown;
  /**
   * TODO: Deselection mechanism...?
   */
  // onDeselection?: (index: number) => unknown;
}> = ({ limitSelectionTo = null, selectionCallback, resetCallback }) => {
  /**
   * NOTE: This component should maintain its own internal state and not rely
   * on global state! This is what callbacks are for!
   */
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<LayerSearchResults>([]);
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const handleChange = (term: string) => {
    setTerm(term);
    setResults(searchICDCodesLocally(term));
  };

  const handleSelection = (indexInReference: number) => {
    let _ = [...checkedIndices];

    if (!_.includes(indexInReference) || _.length === 0) {
      /**
       * Just a small thing: Allow people to select other items without
       * unchecking what they've already selected. Be nice.
       */
      _.unshift(indexInReference);
      _ = _.slice(0, limitSelectionTo !== null ? limitSelectionTo : _.length);
    } else {
      /**
       * Allow people to uncheck something after they have checked it.
       */
      _ = _.filter((__) => __ !== indexInReference);
    }

    setCheckedIndices(_);

    selectionCallback({
      term,
      checkedIndices: _,
    });
  };

  const handleReset = () => {
    setTerm("");
    setResults([]);
    setCheckedIndices([]);

    resetCallback();
  };

  return (
    <div className="condition-search-box">
      <Row>
        <Col lg={9}>
          <Form>
            <FormGroup>
              <Input
                autoFocus
                placeholder="Type an ICD10 code or a description (e.g. 'conjunctivitis' or 'heart')"
                type={"search"}
                onChange={(e) => handleChange(e.target.value)}
                value={term ? term : ""}
              />
              <FormText className="text-muted-more">
                {term! === "" ? (
                  <span>
                    I will only show you{" "}
                    <strong>the top {LAYER_SEARCH_RESULT_LIMIT} results</strong>{" "}
                    of your query
                  </span>
                ) : (
                  <span>
                    {limitSelectionTo !== null ? (
                      <span>
                        You can select up to{" "}
                        <strong>
                          {limitSelectionTo === 1
                            ? "one code"
                            : `${limitSelectionTo} codes`}
                        </strong>
                        .
                      </span>
                    ) : (
                      <span>You can select any number of codes.</span>
                    )}{" "}
                    {limitSelectionTo === 1 &&
                      "You can pick another code by clicking it."}
                    {checkedIndices.length !== limitSelectionTo &&
                      " Clear the box above to search for other codes."}
                  </span>
                )}
              </FormText>
            </FormGroup>
          </Form>
        </Col>
        <Col>
          <Button
            color="warning"
            className="w-100"
            onClick={handleReset}
            disabled={!term || checkedIndices.length === 0}
          >
            <GrPowerReset className="icon" />{" "}
            <span className="fw-600">
              Reset Condition
              {checkedIndices.length > 1 && "s"}
            </span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Results
            searchResults={results}
            checkedIndices={checkedIndices}
            selectionSaturated={checkedIndices.length === limitSelectionTo}
            callback={(indexInReference) => handleSelection(indexInReference)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Component;
