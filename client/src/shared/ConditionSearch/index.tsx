import { useState } from "react";
import { Condition, L, LAYER_NAME } from "../../data/layers";
import {
  LayerSearchResults,
  searchICDCodesLocally,
  LAYER_SEARCH_RESULT_LIMIT,
} from "./search";
import { ICDCode } from "../components";

const SearchResults: React.FC<{
  searchResults: LayerSearchResults;
  indicesInLayerList: number[];
  selectionsAreSaturated?: boolean;
  callback: (indexInReference: number) => unknown;
}> = ({
  searchResults,
  indicesInLayerList,
  selectionsAreSaturated = false,
  callback,
}) => {
  if (searchResults.length === 0) {
    return <></>;
  }

  return (
    <table className="condition-selection-table">
      <tbody>
        {searchResults.slice(0, LAYER_SEARCH_RESULT_LIMIT).map((_) => (
          <tr
            onClick={() => {
              if (!indicesInLayerList.includes(_.refIndex)) {
                callback(_.refIndex);
              }
            }}
            key={`condition-${_.refIndex}`}
            role="button"
            className={[
              indicesInLayerList.includes(_.refIndex) ? "checked" : "",
              selectionsAreSaturated ? "saturated" : undefined,
            ]
              .join(" ")
              .trim()}
          >
            <td className="align-top">{_.item.description}</td>
            <td className="text-end align-top">
              <ICDCode>{_.item.displayCode}</ICDCode>
            </td>
            <td className="text-end align-top">
              <span>{LAYER_NAME[_.item.layer].short}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const SearchCodes: React.FC<{
  limitSelectionTo?: number | null;
  selectionCallback: (conditions: Condition[]) => unknown;
  showResetButton?: boolean;
  /**
   * TODO: Deselection mechanism...?
   */
  // onDeselection?: (index: number) => unknown;
}> = ({
  limitSelectionTo = null,
  selectionCallback,
  showResetButton = true,
}) => {
  /**
   * NOTE: This component should maintain its own internal state and not rely
   * on global state! This is what callbacks are for!
   */
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<LayerSearchResults>([]);
  const [indicesInLayerList, setIndicesInLayerList] = useState<number[]>([]);

  const handleSelection = (indexInReference: number) => {
    let _ = [...indicesInLayerList];

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

    setIndicesInLayerList(_);
    selectionCallback(_.map((__) => L[__]));
  };

  const handleReset = () => {
    setTerm("");
    setResults([]);
    setIndicesInLayerList([]);
  };

  return (
    <>
      <form
        className="flex flex-grow gap-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label className="input input-lg input-bordered flex flex-grow gap-2">
          <input
            autoFocus
            type="search"
            className="grow"
            value={term}
            placeholder="Type an ICD10 code or a description (e.g. 'conjunctivitis' or 'heart' or 'e54')"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              setTerm(target.value);
              setResults(searchICDCodesLocally(target.value));
            }}
          />
        </label>
        {showResetButton && (
          <button
            type="submit"
            className="btn btn-warning btn-lg text-white"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </form>
      <div className="label">
        {term! === "" ? (
          <span className="ml-2">
            I will show you{" "}
            <strong className="font-semibold">
              the top {LAYER_SEARCH_RESULT_LIMIT} results
            </strong>{" "}
            of your query.
          </span>
        ) : (
          <span>
            {limitSelectionTo !== null ? (
              <span>
                You can select up to{" "}
                <strong className="font-semibold">
                  {limitSelectionTo === 1
                    ? "one code"
                    : `${limitSelectionTo} codes`}
                </strong>
                .
              </span>
            ) : (
              <span>You can select any number of codes.</span>
            )}{" "}
            {limitSelectionTo === 1 && "You can pick another by clicking it."}{" "}
            {indicesInLayerList.length !== limitSelectionTo &&
              "Hit the reset button to start over."}
          </span>
        )}
      </div>

      <div className="mt-2 max-h-72 overflow-y-auto">
        <SearchResults
          searchResults={results}
          indicesInLayerList={indicesInLayerList}
          selectionsAreSaturated={
            indicesInLayerList.length === limitSelectionTo
          }
          callback={(indexInReference) => handleSelection(indexInReference)}
        />
      </div>
    </>
  );
};
