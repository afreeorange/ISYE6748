import { NavLink } from "react-router-dom";
import {
  PiShootingStarDuotone,
  PiFlaskDuotone,
  PiHandWavingDuotone,
  PiNumberCircleOneDuotone,
  PiNumberCircleTwoDuotone,
  PiHandPointingDuotone,
  PiBookOpenTextDuotone,
} from "react-icons/pi";
import { H1 } from "../shared/components";

const Home = () => (
  <div className="hero">
    <div className="hero-content text-center">
      <div className="max-w-2xl">
        <H1>
          Hi there!{" "}
          <PiHandWavingDuotone className="inline -scale-x-100 -mt-2 ml-1" />
        </H1>
        <p className="text-2xl text-left mb-6 mt-12">
          This is{" "}
          <NavLink
            to="/about"
            className={"underline decoration-2 underline-offset-2"}
          >
            our
          </NavLink>{" "}
          grad school project. We were given a lot of medical encounter data and
          built models that{" "}
          <PiNumberCircleOneDuotone className={"inline -mt-1"} /> let you see
          conditions related to a given disease, and{" "}
          <PiNumberCircleTwoDuotone className={"inline -mt-1"} /> examine
          someone&#8217;s hypothetical medical journey based on conditions they
          may have.
        </p>
        <p className="text-xl text-left my-6">
          If you&#8217;re with Capgemini Healthcare, you can view a real{" "}
          patient&#8217;s predicted journey as well{" "}
          <PiShootingStarDuotone className="inline" />{" "}
        </p>
        <NavLink
          to="/analyze"
          className="btn btn-success btn-lg text-2xl w-full text-white mt-8 join-item"
        >
          <PiFlaskDuotone className="inline text-2xl" /> Get Started
        </NavLink>

        <div className="mt-8 ">
          You can also{" "}
          <a
            href="/report.pdf"
            title="Read our final report"
            className="font-semibold underline underline-offset-2"
          >
            read our final report
          </a>{" "}
          <PiBookOpenTextDuotone className="inline ml-0.5" />
        </div>

        <div className="mt-8 text-sm border border-dotted mx-auto px-4 py-2 rounded-lg text-left shadow-sm text-yellow-500 border-yellow-500">
          <PiHandPointingDuotone className="inline align-middle rotate-90" />{" "}
          <strong>Please note:</strong> Our backend is rather heavy on our
          wallets and is{" "}
          <strong className="font-semibold">currently offline</strong>. This
          means you&#8217;ll{" "}
          <strong className="font-semibold">
            see stubborn, cached results
          </strong>
          . Yeah, bummer. Please see our Github repository for information on
          how to run our project locally.
        </div>
      </div>
    </div>
  </div>
);

export default Home;
