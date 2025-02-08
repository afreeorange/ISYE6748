import React from "react";
import { PiTreeViewDuotone } from "react-icons/pi";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { M, LAYER_NAME, Condition } from "../../data/layers";
import { H2, ICDCode } from "../components";

/**
 * NOTE: With all these tiles and components, you are going in _reverse_ of the
 * `hierarchy` array! It goes from most specfic to least specific, left to
 * right.
 */

const Tile: React.FC<{
  hierarchyLevel: number;
  description: string;
  displayCode: string;
  current?: boolean;
}> = ({ description, displayCode, hierarchyLevel, current = false }) => (
  <div className={`flex ${current ? "opacity-100" : "opacity-50"}`}>
    <div
      className={`flex-grow inline-block ${
        {
          1: "ml-0",
          2: "ml-0",
          3: "ml-8",
        }[hierarchyLevel]
      } ${current ? "font-semibold" : undefined}`}
    >
      {hierarchyLevel !== 1 && (
        <MdOutlineSubdirectoryArrowRight className="inline mr-4" />
      )}
      {description}
    </div>
    <div>
      <ICDCode>{displayCode}</ICDCode>
    </div>
  </div>
);

const One: React.FC<{
  condition: Condition;
}> = ({ condition }) => (
  <div data-id={"layer-1"}>
    <Tile
      hierarchyLevel={1}
      description={condition.description}
      displayCode={condition.displayCode}
      current
    />
    {condition.children.map((_) => (
      <Tile
        key={`layer-condition-${_}`}
        hierarchyLevel={2}
        description={M[_].description}
        displayCode={M[_].displayCode}
      />
    ))}
  </div>
);

const Two: React.FC<{
  condition: Condition;
}> = ({ condition }) => (
  <div data-id={"layer-2"}>
    <Tile
      hierarchyLevel={1}
      description={M[condition.hierarchy[1]].description}
      displayCode={M[condition.hierarchy[1]].displayCode}
    />
    <Tile
      hierarchyLevel={2}
      description={condition.description}
      displayCode={condition.displayCode}
      current
    />
    {condition.children.map((_) => (
      <Tile
        key={`layer-condition-${_}`}
        hierarchyLevel={3}
        description={M[_].description}
        displayCode={M[_].displayCode}
      />
    ))}
  </div>
);

const Three: React.FC<{
  condition: Condition;
}> = ({ condition }) => (
  <div data-id={"layer-3"}>
    <Tile
      hierarchyLevel={1}
      description={M[condition.hierarchy[2]].description}
      displayCode={M[condition.hierarchy[2]].displayCode}
    />
    <Tile
      hierarchyLevel={2}
      description={M[condition.hierarchy[1]].description}
      displayCode={M[condition.hierarchy[1]].displayCode}
    />
    {M[condition.hierarchy[1]].children.map((_) => (
      <Tile
        key={`layer-condition-${_}`}
        hierarchyLevel={3}
        description={M[_].description}
        displayCode={M[_].displayCode}
        current={M[_].code === condition.code}
      />
    ))}
  </div>
);

const countChildConditions = (code: string) =>
  M[code].children
    .map((_) => M[_].children)
    .reduce((total, _) => total + _.length, 0);

const ConditionHierarchy: React.FC<{
  condition: Condition;
}> = ({ condition }) => (
  <div>
    <H2>
      <PiTreeViewDuotone className="inline" /> Condition Hierarchy
    </H2>
    <div>
      <p className="my-4">
        You picked a <strong>{LAYER_NAME[condition.layer].singular}</strong>.{" "}
        {condition.layer === 1 && (
          <span>
            It encompasses{" "}
            <strong className="font-semibold">
              {M[condition.code].children.length} {LAYER_NAME[2].full}
            </strong>{" "}
            and{" "}
            <strong className="font-semibold">
              {countChildConditions(condition.code)} {LAYER_NAME[3].full}
            </strong>
            . Here are the broad conditions.
          </span>
        )}
        {condition.layer === 2 && (
          <span>
            It is part of a{" "}
            <strong className="font-semibold">
              {LAYER_NAME[1].singular} called &#8220;
              {M[condition.hierarchy[1]].description}
              &#8221;
            </strong>
            and encompasses{" "}
            <strong className="font-semibold">
              {condition.children.length} {LAYER_NAME[3].full}
            </strong>
            . Here's a hierarchy.
          </span>
        )}
        {condition.layer === 3 && (
          <span>
            It is part of a{" "}
            <strong className="font-semibold">
              {LAYER_NAME[2].singular} of &#8220;
              {M[condition.hierarchy[2]].description}
              &#8221;
            </strong>{" "}
            and a{" "}
            <strong className="font-semibold">
              {LAYER_NAME[1].singular} of &#8220;
              {M[condition.hierarchy[1]].description}
              &#8221;
            </strong>
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
