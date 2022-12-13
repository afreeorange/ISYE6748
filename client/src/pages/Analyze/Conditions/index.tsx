import { useContext } from "react";
import { Row, Col, Button, Spinner, Badge } from "reactstrap";
import { GrPowerReset } from "react-icons/gr";
import { ImLab } from "react-icons/im";

import ConditionHierarchy from "../../../components/Hierarchy";
import Results from "./Results";
import ConditionSearchBox from "../../../components/ConditionSearchBox";
import { L } from "../../../layers";
import services from "../../../services/api";
import { StateContext } from "../../../state/Provider";
import { AxiosError } from "axios";
import UpstreamError from "../../../components/UpstreamError";
import NotFound from "./NotFound";

const Component: React.FC = () => {
  const {
    conditionSearchData,
    conditionSearchResults,
    conditionSearchState,
    setConditionSearchData,
    setConditionSearchResults,
    setConditionSearchState,
    setConditionSearchTerm,
    resetConditionState,
  } = useContext(StateContext)!;

  const handleSubmit = async () => {
    setConditionSearchState("processing");

    try {
      setConditionSearchResults(
        await services.condition.similarTo(conditionSearchData!.code)
      );
      setConditionSearchState("processed");
    } catch (e) {
      if ((e as AxiosError).response?.status === 404) {
        let { data } = (e as AxiosError).response!;

        if ((data as string).includes("not in list")) {
          setConditionSearchState("error");
          setConditionSearchResults({
            "1": [],
            "2": [],
            "3": [],
          });

          return;
        }
      }

      setConditionSearchState("error");
    }
  };

  const handleSelection = (checkedIndices: number[]) => {
    setConditionSearchData(L[checkedIndices[0]]);
  };

  const handleReset = () => {
    setConditionSearchTerm(null);
    setConditionSearchData(null);
    setConditionSearchState("idle");
    setConditionSearchResults(null);
  };

  return (
    <div>
      <h2 className="my-4">
        {["processed", "error"].includes(conditionSearchState) && (
          <Row>
            <Col>
              <span className="fw-600">
                Conditions related to{" "}
                <span className="fw-800">
                  {conditionSearchData?.description}
                </span>
                <Badge
                  color="dark"
                  className="ms-2 py-1 px-2 text-small"
                  style={{}}
                >
                  {conditionSearchData?.displayCode}
                </Badge>
              </span>
            </Col>
            {conditionSearchState !== "error" && (
              <Col sm={2} className="text-end">
                <Button
                  color="warning"
                  className="py-1 px-2 ms-3"
                  onClick={() => resetConditionState(null)}
                >
                  <GrPowerReset className="icon" />{" "}
                  <span className="fw-600">New Search</span>
                </Button>
              </Col>
            )}
          </Row>
        )}
        {["idle", "processing"].includes(conditionSearchState) && (
          <span>
            I want to{" "}
            {!conditionSearchData ? (
              <span className="fw-600">find related conditions.</span>
            ) : (
              <span>
                <span className="fw-600">find conditions related to</span>{" "}
                <span className="fw-800">
                  {conditionSearchData.description}
                </span>
              </span>
            )}
          </span>
        )}
      </h2>
      {conditionSearchData &&
        conditionSearchState !== "processed" &&
        conditionSearchState !== "error" && (
          <>
            <Row>
              <Col>
                <Button
                  color="success"
                  className="w-100"
                  onClick={() => handleSubmit()}
                  onMouseEnter={() => {
                    document
                      .querySelector(".condition-hierarchy")
                      ?.classList.add("blur-things");
                    document
                      .querySelector(".condition-search-box")
                      ?.classList.add("blur-things");
                  }}
                  onMouseLeave={() => {
                    document
                      .querySelector(".condition-hierarchy")
                      ?.classList.remove("blur-things");
                    document
                      .querySelector(".condition-search-box")
                      ?.classList.remove("blur-things");
                  }}
                >
                  {conditionSearchState === "processing" ? (
                    <Spinner size={"sm"} />
                  ) : (
                    <span>
                      <ImLab className="icon" />{" "}
                      <strong>Find Related Conditions</strong>
                    </span>
                  )}
                </Button>
              </Col>
            </Row>
            <Row className="my-4">
              <Col>
                <ConditionHierarchy condition={conditionSearchData} />
              </Col>
            </Row>
          </>
        )}
      {conditionSearchState === "idle" && (
        <ConditionSearchBox
          limitSelectionTo={1}
          selectionCallback={({ checkedIndices }) =>
            handleSelection(checkedIndices)
          }
          resetCallback={() => handleReset()}
        />
      )}
      {conditionSearchState === "processed" && (
        <Results results={conditionSearchResults} />
      )}
      {conditionSearchState === "error" && conditionSearchResults !== null && (
        <NotFound resetHandler={handleReset} />
      )}
      {conditionSearchState === "error" && conditionSearchResults === null && (
        <Row className="mt-4">
          <UpstreamError onButtonClick={handleReset} />
        </Row>
      )}
    </div>
  );
};

export default Component;
