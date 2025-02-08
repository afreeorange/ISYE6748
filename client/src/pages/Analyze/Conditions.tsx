import { useNavigate, useParams } from "react-router-dom";
import { H1, H2, ICDCode, Loading, ResetButton } from "../../shared/components";

import ConditionHierarchy from "../../shared/ConditionSearch/Hierarchy";
import { type Condition, M } from "../../data/layers";
import { useState } from "react";
import { PiRocketLaunchDuotone } from "react-icons/pi";
import { useQuery } from "@tanstack/react-query";
import { conditionQuery } from "../../shared/queries";
import NotFound from "../404";
import Whoops from "../Whoops";
import { PredictionTuple } from "../../data";
import { SearchCodes } from "../../shared/ConditionSearch";

export const Form = () => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Condition[] | null>(null);
  const [resetKey, setResetKey] = useState(0); // Just remount on reset...

  const callback = (w: Condition[]) => {
    setSelections(w);
  };

  return (
    <>
      <H1>
        {selections
          ? `I want to find conditions related to ${selections[0].description}`
          : `I want to find related conditions`}

        <ResetButton
          clickHander={() => {
            if (selections) {
              setResetKey((_) => _ + 1);
              setSelections(null);
            } else {
              navigate("..", {
                relative: "path",
              });
            }
          }}
        />

        {selections && (
          <button
            className="inline-flex gap-2 btn ml-2 text-white text-2xl btn-success px-4 tracking-normal shadow-xl align-middle"
            style={{
              animationIterationCount: 2,
            }}
            onClick={() => {
              navigate(`${selections[0].code}`);
            }}
          >
            Go! <PiRocketLaunchDuotone className="text-white" />
          </button>
        )}
      </H1>

      <SearchCodes
        key={resetKey}
        limitSelectionTo={1}
        selectionCallback={callback}
        showResetButton={false}
      />

      {selections && <ConditionHierarchy condition={selections[0]} />}
    </>
  );
};

const ResultsTable: React.FC<{
  results: PredictionTuple[];
}> = ({ results }) => (
  <>
    {results.length > 0 ? (
      <table className="similar-conditions-table">
        {results.map((_: any) => (
          <tr>
            <td>{M[_[0]].description}</td>
            <td className="text-end">
              <ICDCode>{M[_[0]].displayCode}</ICDCode>{" "}
            </td>
            <td className="font-mono text-end">{_[1].toFixed(4)}</td>
          </tr>
        ))}
      </table>
    ) : (
      <p>We could not find any results at this level of specificity</p>
    )}
  </>
);

export const Results = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading, isError } = useQuery(conditionQuery(params.code!));

  if (!params.code) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Whoops />;
  }

  const condition = M[params.code];

  return (
    <>
      <H1>
        Conditions related to {condition.description}{" "}
        {/* <span className="outline rounded-lg px-2 mx-2">{condition.code}</span> */}
        <ResetButton
          clickHander={() => {
            navigate("..", {
              relative: "path",
            });
          }}
        />
      </H1>
      <p>
        We&#8217;re showing you what our model thinks are the conditions closest
        to your query at each level of specificity. The numbers on the right
        denote a <strong className="font-semibold">similarity score</strong> on
        a continuous scale of zero (not similar at all) to one (is the same
        condition).
      </p>

      <H2>Specific Conditions</H2>
      <ResultsTable results={data![3]} />

      <H2>Broad Conditions</H2>
      <ResultsTable results={data![2]} />

      <H2>Very Broad Conditions</H2>
      <ResultsTable results={data![1]} />
    </>
  );
};
