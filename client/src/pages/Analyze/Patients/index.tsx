import { useContext } from "react";

import { StateContext } from "../../../state/Provider";
import Existing from "./Existing";

const Component: React.FC = () => {
  const { activeAnalysis, setActiveAnalysis } = useContext(StateContext)!;

  return (
    <div>
      {activeAnalysis === "__patients" && (
        <h2>
          I want to{" "}
          <span className="fw-600">
            examine journeys of{" "}
            <u onClick={() => setActiveAnalysis("__patients_existing")}>
              existing patients
            </u>{" "}
            <span className="text-muted-more fw-300">
              with a Member Life ID I know
            </span>{" "}
            or{" "}
            <u onClick={() => setActiveAnalysis("__patients_new")}>
              new patients
            </u>{" "}
            <span className="text-muted-more fw-300">
              with a profile I will create.
            </span>
          </span>
        </h2>
      )}
      {activeAnalysis === "__patients_existing" && <Existing />}
      {/* {activeAnalysis === "__patients_new" && <New />} */}
    </div>
  );
};

export default Component;
