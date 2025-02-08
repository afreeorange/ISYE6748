import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  H1,
  Loading,
  PatientAvatar,
  ResetButton,
} from "../../shared/components";
import { knownPatientQuery } from "../../shared/queries";
import NotFound from "../404";
import { LayerNumber } from "../../data/layers";
import Whoops from "../Whoops";
import { FrequencyTable, SimilaritySection, PotentialSection } from "./common";

const Shell = ({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: number | null;
  title: string;
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-48 float-right ml-8">
        <PatientAvatar seed={id || 0} />
      </div>
      <H1>
        <span
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <ResetButton
          clickHander={() =>
            navigate("..", {
              relative: "path",
            })
          }
        />
      </H1>
      {children}
    </>
  );
};

export const Form = () => {
  const navigate = useNavigate();
  const [id, setID] = useState<number | null>(null);

  return (
    <Shell
      id={id}
      title={
        id
          ? `I want to study Patient ${id}&#8217;s medical journey`
          : "I want to study the journey of a patient with an ID I know"
      }
    >
      <form
        className="flex flex-grow gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`${id}`);
        }}
      >
        <label className="input input-lg input-bordered flex flex-grow gap-2">
          <input
            autoFocus
            type="search"
            className="grow"
            placeholder="Enter an ID (e.g. 154, 428, 3140, 4884)"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, "");
              setID(Number.parseInt(target.value));
            }}
          />
        </label>
        <button
          disabled={!id}
          type="submit"
          className="btn btn-success btn-lg text-white"
        >
          See Journey
        </button>
      </form>
      <div className="label ml-2 opacity-25">Numbers only!</div>
    </Shell>
  );
};

export const Results = () => {
  const params = useParams();
  const [tab, setTab] = useState<1 | 2 | 3>(1);
  const { data, isLoading, isError, isSuccess } = useQuery(
    knownPatientQuery(params.id!)
  );

  useEffect(() => {
    if (isSuccess) {
      if (data?.thisPatient.layerInfo[1].length > 0) {
        setTab(1);
      } else if (data?.thisPatient.layerInfo[2].length > 0) {
        setTab(2);
      } else {
        setTab(3);
      }
    }
  }, [isSuccess]);

  // ======================================================================

  if (Number.isNaN(Number(params.id))) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Whoops />;
  }

  // ======================================================================

  const summary = {
    veryBroad: data?.thisPatient.layerInfo[1].length || "zero",
    broad: data?.thisPatient.layerInfo[2].length || "no",
    specific: data?.thisPatient.layerInfo[3].length || "no",
  };

  const linkClasses = {
    active: "font-bold",
    inactive:
      "font-semibold cursor-pointer underline underline-offset-2 decoration-2",
    none: "font-normal",
  };

  const getClassname = (layer: LayerNumber) =>
    data?.thisPatient.layerInfo[layer].length === 0
      ? linkClasses.none
      : tab === layer
      ? linkClasses.active
      : linkClasses.inactive;

  return (
    <Shell id={parseInt(params.id!)} title={`Patient ${params.id}`}>
      <section>
        {/* Summary Sentence. Repetitive but this is better than reading a loop */}
        <h2 className="text-3xl tracking-tight mb-6">
          This person has{" "}
          <strong
            className={getClassname(1)}
            onClick={() =>
              data!.thisPatient.layerInfo[1].length > 0 ? setTab(1) : {}
            }
          >
            {summary.veryBroad} very broad
          </strong>
          ,{" "}
          <strong
            className={getClassname(2)}
            onClick={() =>
              data!.thisPatient.layerInfo[2].length > 0 ? setTab(2) : {}
            }
          >
            {summary.broad} broad
          </strong>
          , and{" "}
          <strong
            className={getClassname(3)}
            onClick={() =>
              data!.thisPatient.layerInfo[3].length > 0 ? setTab(3) : {}
            }
          >
            {summary.specific} specific
          </strong>{" "}
          conditions.
        </h2>

        {/* Frequency Tables */}
        <FrequencyTable
          frequencies={data!.thisPatient!.layerInfo[1]}
          precision={0}
          className={tab !== 1 ? "hidden" : undefined}
        />
        <FrequencyTable
          frequencies={data!.thisPatient!.layerInfo[2]}
          precision={0}
          className={tab !== 2 ? "hidden" : undefined}
        />
        <FrequencyTable
          frequencies={data!.thisPatient!.layerInfo[3]}
          precision={0}
          className={tab !== 3 ? "hidden" : undefined}
        />
      </section>

      {/* ----------------------------------------------------------------- */}

      <SimilaritySection data={data!} />

      {/* ----------------------------------------------------------------- */}

      <PotentialSection data={data!} />
    </Shell>
  );
};
