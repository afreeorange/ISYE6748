import { useState } from "react";
import { PiRocketLaunchDuotone } from "react-icons/pi";
import type { Condition } from "../../data/layers";
import {
  H1,
  Loading,
  PatientAvatar,
  ResetButton,
} from "../../shared/components";
import { SearchCodes } from "../../shared/ConditionSearch";
import { useQuery } from "@tanstack/react-query";
import { newPatientQuery } from "../../shared/queries";
import Whoops from "../Whoops";
import { PotentialSection, SimilaritySection } from "./common";
import { useNavigate } from "react-router-dom";

export const Form = () => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Condition[] | null>(null);
  const [resetKey, setResetKey] = useState(0); // Just remount on reset...
  const [ready, setReady] = useState(false);

  const callback = (w: Condition[]) => {
    setSelections(w);
  };

  const { data, isSuccess, isLoading, isError } = useQuery({
    ...newPatientQuery(selections ? selections.map((_) => _.code) : []),
    enabled: selections !== null && ready,
  });

  if (isError) {
    return <Whoops />;
  }

  return (
    <>
      <div className="w-48 float-right ml-8">
        <PatientAvatar
          seed={selections ? selections.map((_) => _.code).join("") : 0}
        />
      </div>
      <H1>
        I want to create a fictitious patient and study their predicted journey
        <ResetButton
          clickHander={() => {
            if (selections) {
              setResetKey((resetKey) => resetKey + 1);
              setSelections(null);
              setReady(false);
            } else {
              navigate("../..", {
                relative: "path",
              });
            }
          }}
        />
        {selections && !ready && (
          <button
            type="button"
            className="inline-flex gap-2 btn ml-2 text-white text-2xl btn-success px-4 tracking-normal shadow-xl align-middle"
            style={{
              animationIterationCount: 2,
            }}
            onClick={() => {
              /**
               * At some later point, we'll use the URI to drive this <3
               */
              navigate(`?codes=${selections.map((_) => _.code)}`);
              setReady(true);
            }}
          >
            Go! <PiRocketLaunchDuotone className="text-white" />
          </button>
        )}
      </H1>

      {selections && (
        <h2 className="text-4xl mb-6">
          This person has{" "}
          {selections
            .map<React.ReactNode>((_) => (
              <strong
                className="font-semibold"
                key={`condition-${_.description}`}
              >
                {_.description}
              </strong>
            ))
            .reduce((prev, curr, i, arr) => {
              if (i !== arr.length - 1) {
                return [prev, ", ", curr];
              }

              if (i === 1) {
                return [prev, " and ", curr];
              }

              return [prev, ", and ", curr];
            })}
          .
        </h2>
      )}

      {isLoading && <Loading />}

      {!ready && (
        <SearchCodes
          key={resetKey}
          limitSelectionTo={5}
          selectionCallback={callback}
          showResetButton={false}
        />
      )}

      {data && isSuccess && (
        <>
          <SimilaritySection data={data!} />
          <PotentialSection data={data!} />
        </>
      )}
    </>
  );
};
