import { NavLink, useLocation } from "react-router-dom";
import { createAvatar } from "@dicebear/core";
import { micah } from "@dicebear/collection";

import {
  PiFlaskDuotone,
  PiDatabaseDuotone,
  PiInfoDuotone,
  PiGithubLogoDuotone,
  PiDotsThreeBold,
  PiArrowCounterClockwiseBold,
  PiHandHeartDuotone,
  PiSpiralLight,
} from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import React, { useEffect, useState } from "react";

export const H1: React.FC<{
  children: string | React.ReactNode;
}> = ({ children }) => (
  <h1 className="text-5xl font-bold tracking-tight mb-6">{children}</h1>
);

export const H2: React.FC<{
  children: string | React.ReactNode;
}> = ({ children }) => (
  <h2 className={`text-3xl font-bold tracking-tight mb-4 mt-8`}>{children}</h2>
);

const NavItem: React.FC<React.HTMLProps<HTMLUListElement>> = (props) => (
  <ul {...props}>
    <li>
      <NavLink to="/analyze">
        <PiFlaskDuotone /> Analyze
      </NavLink>
    </li>
    <li>
      <NavLink to="/data">
        <PiDatabaseDuotone /> Data
      </NavLink>
    </li>
    <li>
      <NavLink to="/about">
        <PiInfoDuotone /> About
      </NavLink>
    </li>
  </ul>
);

export const Navigation = () => {
  const [isOpen, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Detect route change and close the menu
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={() => setOpen(true)}
          >
            <GiHamburgerMenu className="text-2xl" />
          </div>
          <NavItem
            className={`menu menu-lg dropdown-content bg-base-100 border rounded-box z-[1] mt-3 w-52 p-2 shadow-xl ${
              !isOpen && "hidden"
            }`}
          />
        </div>
        <NavLink
          className="btn btn-ghost text-2xl tracking-tight lowercase"
          style={{
            fontWeight: 600,
          }}
          to={"/"}
        >
          <span aria-label="Emoji of a Ninja">🥷</span> The ICD10 Ninja
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <NavItem className="menu menu-horizontal px-1 text-lg" />
      </div>
      <div className="navbar-end">
        <a
          className="w-9 mr-2 -mt-3 hover:scale-110 transition-all"
          href="https://www.analytics.gatech.edu/"
          title="Link to the Georgia Tech Analytics program"
        >
          <img alt="Buzz! The Georgia Tech Mascot!" src="/logo-bee.png" />
        </a>
      </div>
    </div>
  );
};

export const Footer = () => (
  <footer className="px-4 text-sm text-center mt-12 mb-10">
    <p>
      <NavLink to="/about" className="link">
        Disclaimer
      </NavLink>{" "}
      <PiDotsThreeBold className="inline mx-2" /> GNU GPLv3 Licensed{" "}
      <span className="mx-1 inline-block">/</span>
      <a
        href="https://github.com/afreeorange/ISYE6748/"
        title="This project's source code on Github"
        className="link"
      >
        Source on Github <PiGithubLogoDuotone className="inline-block" />
      </a>
    </p>
  </footer>
);

export const PatientAvatar: React.FC<{
  seed: number | string | null;
  className?: string;
}> = ({ seed, className }) => (
  <div
    className={`patient-avatar ${
      !seed ? "no-patient-selected" : ""
    } ${className}`}
    dangerouslySetInnerHTML={{
      __html: createAvatar(micah, {
        seed: seed?.toString(),
      }),
    }}
  />
);

export const Loading = () => (
  <div className="p-8 text-center">
    <PiSpiralLight
      className="animate-spin text-[18rem] mx-auto mb-8"
      style={{
        animationDirection: "reverse",
      }}
    />
    <p>
      <span className="font-semibold">This may take up to ten seconds.</span>
      <br />
      Or more. Thank you for your patience{" "}
      <PiHandHeartDuotone className="inline" />
    </p>
  </div>
);

export const ResetButton: React.FC<{
  clickHander: () => unknown;
}> = ({ clickHander }) => (
  <button
    className="inline-flex gap-2 btn ml-2 text-2xl btn-warning px-2.5 tracking-normal"
    onClick={clickHander}
  >
    <PiArrowCounterClockwiseBold />
  </button>
);

export const ICDCode: React.FC<{ children: string | React.ReactNode }> = ({
  children,
}) => (
  <span className="badge badge-success font-mono text-white text-xs">
    {children}
  </span>
);
