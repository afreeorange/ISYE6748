import { useContext } from "react";
import { Spinner } from "reactstrap";
import { StateContext } from "../state/Provider";

import "./Processing.css";

const WhirlLikeADervish: React.FC = () => (
  <div className="processing d-flex justify-content-center align-items-center flex-column">
    <Spinner color="info" />
    <h4 className="mt-5 text-center">
      This may take up to ten seconds&hellip;
      <br />
      <small className="text-muted">Or more. Thank you for your patience 🙏</small>
    </h4>
  </div>
);

const Component: React.FC = () => {
  const { processingState } = useContext(StateContext)!;

  return processingState === "processing" ? <WhirlLikeADervish /> : null;
};

export default Component;
