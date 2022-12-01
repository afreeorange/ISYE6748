import { useState } from "react";
import { ImPointRight } from "react-icons/im";
import { HiOutlineDatabase } from "react-icons/hi";
import { TbCircle1, TbCircle2, TbCircle3 } from "react-icons/tb";
import { Col, Row } from "reactstrap";

import LayersExample from "./layers.jpg";
import ConditionSearchBox from "../components/ConditionSearchBox";
import Hierarchy from "../components/Hierarchy";
import { L } from "../layers";

import "./Data.css";

const Component: React.FC = () => {
  const [indices, setIndices] = useState<number[]>([]);

  return (
    <div
      className="data mb-5"
      style={{
        paddingBottom: indices.length > 0 ? "0em" : "30em",
      }}
    >
      <Row>
        <Col>
          <h1 className="border-bottom pb-2">
            <HiOutlineDatabase className="text-info icon" />{" "}
            <span className="fw-600">The Data</span>
          </h1>
        </Col>
      </Row>

      <section className="mt-3">
        <p>
          This project uses two primary sources of data:{" "}
          <TbCircle1 className="icon" /> raw datasets of patient records
          (medical and pharmaceutical claims) from our sponsor and{" "}
          <TbCircle2 className="icon" /> ICD10 Diagnostic Codes from{" "}
          <a href="https://www.cms.gov/medicare/icd-10/2023-icd-10-cm">
            the Centers for Medicare &amp; Medical Services
          </a>
          . You may view the raw data and our transformations in our{" "}
          <a
            href="https://github.com/afreeorange/ISYE6748"
            title="Link to project repository on Github"
          >
            project's Github repository
          </a>
        </p>
        <p>
          ICD10 Codes are a disease classification taxonomy developed and
          maintained by the World Health Organization. As of 2023, there are
          73,639 of them and they are organized into hierarchies. The image
          below shows where a diagnosis like "Microscopic colitis" lies in the
          ICD10 hierarchy. The orange text is the ICD10 code. The blue text is
          our own assignment of a <span className="fw-600">Layer</span> to
          various levels of this hierarchy.
        </p>
        <img
          src={LayersExample}
          className="mw-100 hierarchy"
          alt="Example of ICD10 Class hierarchy"
        />
        <p className="mt-4">
          When you use this website and see the results of a query,
          <ul className="mt-3">
            <li>
              a <span className="fw-600">Very Broad</span> condition maps to{" "}
              <span className="fw-600 layer-color">
                Layer <TbCircle1 className="layer-icon" />
              </span>
            </li>
            <li>
              a <span className="fw-600">Broad</span> condition maps to{" "}
              <span className="fw-600 layer-color">
                Layer <TbCircle2 className="layer-icon" />
              </span>
              , and
            </li>
            <li>
              a <span className="fw-600">Specific</span> condition maps to{" "}
              <span className="fw-600 layer-color">
                Layer <TbCircle3 className="layer-icon" />
              </span>
            </li>
          </ul>
        </p>

        <p>
          <ImPointRight className="icon" /> You are encouraged to{" "}
          <a href="/Report.pdf" className="fw-600">
            read our report
          </a>{" "}
          for a further overview of the ICD10 system and how we utilized it in
          our project.
        </p>

        <p>
          You can also view the ICD10 Layer mappings and metadata we used to
          power the disease condition search box on this website:
          <ul className="mt-3">
            <li>
              <a href="/layer_1.json">Layer One</a>{" "}
              <span className="text-muted">(Very Broad Conditions)</span>
            </li>
            <li>
              <a href="/layer_2.json">Layer Two</a>{" "}
              <span className="text-muted">(Broad Conditions)</span>
            </li>
            <li>
              <a href="/layer_3.json">Layer Three</a>{" "}
              <span className="text-muted">(Broad Conditions)</span>
            </li>
          </ul>
        </p>

        <p>
          You can also view <span className="fw-600">all</span> the ICD10
          disease conditions we used in our model{" "}
          <a href="/all_layers_map.json">as a map</a> or{" "}
          <a href="/all_layers_list.json">as a list</a>.
        </p>

        <hr className="my-4" />

        <h2>Search for Disease Conditions</h2>

        <p>
          Search for a condition below to see it in the ICD10 hierarchy (up to
          Layer 3)
        </p>

        {indices.length > 0 && (
          <div className="mb-3">
            <Hierarchy condition={L[indices[0]]} />
          </div>
        )}

        <ConditionSearchBox
          resetCallback={() => setIndices([])}
          limitSelectionTo={1}
          selectionCallback={({ checkedIndices }) => setIndices(checkedIndices)}
        />
      </section>
    </div>
  );
};

export default Component;
