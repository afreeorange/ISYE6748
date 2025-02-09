import { NavLink, Route, Routes } from "react-router-dom";
import {
  PiAsclepiusDuotone,
  PiMagnifyingGlassDuotone,
  PiUserPlusDuotone,
} from "react-icons/pi";

import { H1 } from "../../shared/components";
import {
  Form as KnownPatientForm,
  Results as KnownPatientResults,
} from "./KnownPatient";
import {
  Form as ConditionsForm,
  Results as ConditionsResults,
} from "./Conditions";
import { Form as NewPatientForm } from "./NewPatient";

const Tile: React.FC<{
  icon: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  to: string;
}> = ({ icon, title, description, to }) => (
  <div className="flex my-10 gap-4">
    <div>{icon}</div>
    <div>
      <h3 className="text-2xl md:text-3xl leading-snug">
        <NavLink className={"underline underline-offset-4"} to={to}>
          {title}
        </NavLink>{" "}
        <span className="opacity-40">{description}</span>
      </h3>
    </div>
  </div>
);

const Base = () => (
  <>
    <H1>I want to &hellip;</H1>
    <div className="mb-20">
      <Tile
        to="conditions"
        icon={<PiAsclepiusDuotone className="text-success w-12 h-12 mr-2" />}
        title={
          <span className="font-semibold">
            find <strong>related conditions</strong>.
          </span>
        }
        description="I have Macular Degeneration. What are other associated risks?"
      />
      <Tile
        to="patients/new"
        icon={<PiUserPlusDuotone className="text-success w-12 h-12 mr-2" />}
        title={
          <span className="font-semibold">
            <strong>create a new patient</strong> and study their{" "}
            <strong>predicted medical journey</strong>.
          </span>
        }
        description={
          <>
            I will create a synthetic patient with some disease conditions. The
            models will then give me similar patients and their predicted
            conditions.
          </>
        }
      />
      <Tile
        to="patients"
        icon={
          <PiMagnifyingGlassDuotone className="text-success w-12 h-12 mr-2" />
        }
        title={
          <span className="font-semibold">
            <strong>search for a patient</strong> and study their{" "}
            <strong>predicted medical journey</strong>.
          </span>
        }
        description={
          <>
            I am with Capgemini, have a patient&#8217;s ID, and would like to
            see similar patients and predicted conditions.
          </>
        }
      />
    </div>
  </>
);

const Analyze = () => (
  <Routes>
    <Route path="/patients/new" element={<NewPatientForm />} />
    <Route path="/patients/:id" element={<KnownPatientResults />} />
    <Route path="/patients" element={<KnownPatientForm />} />
    <Route path="/conditions/:code" element={<ConditionsResults />} />
    <Route path="/conditions" element={<ConditionsForm />} />
    <Route index element={<Base />} />
  </Routes>
);

export default Analyze;
