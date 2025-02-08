import { NavLink } from "react-router-dom";
import { H1, H2 } from "../shared/components";

const Whoops = () => (
  <div className="text-center flex-col mt-12">
    <div className="prose">
      <H1>Oh no!</H1>
      <H2>Something went awfully wrong.</H2>
      Sorry about that. Please reload or start{" "}
      <NavLink className={"link"} to="/">
        from the home page
      </NavLink>{" "}
      <span aria-label="Emoji of a Ninja">🥷</span>.
    </div>
  </div>
);

export default Whoops;
