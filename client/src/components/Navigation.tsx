/**
 * Aliasing since there's a `NavLink` in reactstrap as well. Just trying to be
 * clear about the component we're using.
 */
import { NavLink as RouterNavLink } from "react-router-dom";
import { Navbar, Nav, NavItem, Button } from "reactstrap";
import { HiOutlineDatabase } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";
import { GoInfo } from "react-icons/go";
import { ImLab } from "react-icons/im";
import React from "react";
import Logo from "./Navigation-logo.png";

import { StateContext } from "../state/Provider";
import "./Navigation.css";

const StartOver: React.FC<{
  callback: any;
}> = ({ callback }) => {
  return (
    <Button
      className="start-over me-3 py-0"
      color="warning"
      onClick={callback}
      size="sm"
    >
      <GrPowerReset className="icon" />{" "}
      <strong className="fw-600">Start Over</strong>
    </Button>
  );
};

const Component: React.FC = () => {
  const { resetState, activeAnalysis } = React.useContext(StateContext)!;

  return (
    <Navbar dark color="dark">
      <Nav>
        <div>
          <NavItem>
            <RouterNavLink to="/">
              <ImLab className="icon me-1" /> Analyze
            </RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/data">
              <HiOutlineDatabase className="icon me-1" /> Data
            </RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/about">
              <GoInfo className="icon me-1" /> About
            </RouterNavLink>
          </NavItem>
        </div>
        <div>
          {activeAnalysis !== null && (
            <StartOver callback={() => resetState(null)} />
          )}
          <a
            href="https://www.analytics.gatech.edu/"
            title="Link to the Georgia Tech Analytics program"
          >
            <img className="logo" src={Logo} alt="Georgia Tech Analytics" />
          </a>
        </div>
      </Nav>
    </Navbar>
  );
};

export default Component;
