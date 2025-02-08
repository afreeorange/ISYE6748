import { NavLink } from "react-router-dom";
import { H1, H2 } from "../shared/components";

const NotFound = () => (
  <div className="text-center flex-col">
    <div className="prose">
      <H1>Oops&hellip;</H1>
      <H2>I&#8217;m sorry, I could not find that.</H2>
      <>
        <span aria-label="Emoji of a Ninja">🥷</span>{" "}
        <NavLink className={"link"} to="/">
          Back to home page
        </NavLink>
      </>
    </div>
  </div>
);

export default NotFound;
