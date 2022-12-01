import React, { useContext } from "react";
import { Col, Row } from "reactstrap";
import { ImLab } from "react-icons/im";
import { MdOutlineMedicalServices } from "react-icons/md";
import { AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";

import Conditions from "./Conditions";
import { StateContext } from "../../state/Provider";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { AnalysisType } from "../../state/types";
import Existing from "./Patients/Existing";
import New from "./Patients/New";

import "./index.css";

const TABINDEX_TO_ANALYSIS_TYPE: Record<number, AnalysisType> = {
  1: "__conditions",
  2: "__patients_existing",
  3: "__patients_new",
};

const ANALYSIS_TYPE_TO_TAB_INDEX: Record<string, number> = {
  __conditions: 1,
  __patients_existing: 2,
  __patients_new: 3,
};

const ThingsToDo: React.FC = () => {
  const ICON_SIZE = "4em";
  const PADDING_CLASS = "pt-3";
  const PADDING_CLASS_ICON = "pt-0";

  const { setActiveAnalysis, setActiveTab } = useContext(StateContext)!;

  const handleSelection = (analysisType: AnalysisType) => {
    setActiveAnalysis(analysisType);
    setActiveTab(ANALYSIS_TYPE_TO_TAB_INDEX[analysisType as string]);
  };

  return (
    <>
      <h2
        className="fw-600 my-3"
        style={{
          fontSize: "400%",
        }}
      >
        I want to&hellip;
      </h2>
      <Row
        className="analysis-option my-2"
        onClick={() => handleSelection("__conditions")}
      >
        <Col
          sm={1}
          style={{
            fontSize: ICON_SIZE,
          }}
          className={`align-middle ${PADDING_CLASS_ICON}`}
        >
          <MdOutlineMedicalServices className="icon text-info" />
        </Col>
        <Col className={PADDING_CLASS}>
          <h3>
            Find <span className="fw-600">related disease conditions</span>.
          </h3>
          <p className="text-muted fw-300">
            I have Macular Degeneration.{" "}
            <span className="fw-600">
              What are other risks associated with my condition
            </span>
            ?
          </p>
        </Col>
      </Row>
      <Row
        className="analysis-option my-2"
        onClick={() => handleSelection("__patients_existing")}
      >
        <Col
          sm={1}
          style={{
            fontSize: ICON_SIZE,
          }}
          className={`align-middle ${PADDING_CLASS_ICON}`}
        >
          <AiOutlineUser className="icon text-info" />
        </Col>
        <Col className={PADDING_CLASS}>
          <h3>
            <span className="fw-600">Search for a patient</span> and study their{" "}
            <span className="fw-600">predicted medical journeys</span>.
          </h3>
          <p className="text-muted fw-300">
            <span className="fw-600">I have a patient's Member Life ID</span> in
            a known, anonymized database of patients and would like to see{" "}
            <span className="fw-600">
              similar patients and predicted conditions
            </span>
            .
          </p>
        </Col>
      </Row>
      <Row
        className="analysis-option my-2"
        onClick={() => handleSelection("__patients_new")}
      >
        <Col
          sm={1}
          style={{
            fontSize: ICON_SIZE,
          }}
          className={`align-middle ${PADDING_CLASS_ICON}`}
        >
          <AiOutlineUserAdd className="icon text-info" />
        </Col>
        <Col className={PADDING_CLASS}>
          <h3>
            <span className="fw-600">Create a new patient profile</span> and
            study their{" "}
            <span className="fw-600">predicted medical journey</span>.
          </h3>
          <p className="text-muted">
            I will <span className="fw-600">create a patient</span> with some
            disease conditions to see{" "}
            <span className="fw-600">
              similar patients and predicted conditions
            </span>
            .
          </p>
        </Col>
      </Row>
    </>
  );
};

const Component: React.FC = () => {
  const { setActiveAnalysis, activeTab, setActiveTab } =
    useContext(StateContext)!;

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setActiveAnalysis(TABINDEX_TO_ANALYSIS_TYPE[index]);
  };

  return (
    <div>
      <Tabs
        className={"analyze-tabs"}
        selectedIndex={activeTab}
        onSelect={(index) => handleTabChange(index)}
      >
        <div className="top-line">
          <h1>
            <ImLab className="text-info icon" />{" "}
            <span className="fw-600">Analyze</span>
          </h1>
          <TabList>
            <Tab>
              <h4>&nbsp;</h4>
            </Tab>
            <Tab>
              <h4 className="fw-600">
                <MdOutlineMedicalServices className="icon" /> Conditions
              </h4>
            </Tab>
            <Tab>
              <h4 className="fw-600">
                <AiOutlineUser className="icon" /> Existing Patients
              </h4>
            </Tab>
            <Tab>
              <h4 className="fw-600">
                <AiOutlineUserAdd className="icon" /> New Patients
              </h4>
            </Tab>
          </TabList>
        </div>
        <TabPanel>
          <ThingsToDo />
        </TabPanel>
        <TabPanel>
          <Conditions />
        </TabPanel>
        <TabPanel>
          <Existing />
        </TabPanel>
        <TabPanel>
          <New />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Component;
