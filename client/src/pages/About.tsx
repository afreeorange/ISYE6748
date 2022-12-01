import { Col, Row, Alert } from "reactstrap";
import { GoInfo } from "react-icons/go";
import { ImLab, ImPointRight } from "react-icons/im";
import { TbBrandPython, TbCircle1, TbCircle2 } from "react-icons/tb";
import { TiHeartFullOutline } from "react-icons/ti";
import { RiTeamLine } from "react-icons/ri";
import { TbBrandCodepen } from "react-icons/tb";

import Nikhil from "./nikhil.jpg";
import William from "./william.jpg";
import Shrea from "./shrea.jpg";

import "./About.css";

const Component: React.FC = () => (
  <div className="about">
    <Row>
      <Col>
        <h1 className="border-bottom pb-2">
          <GoInfo className="text-info icon" />{" "}
          <span className="fw-600">About</span>
        </h1>
      </Col>
    </Row>
    <Row>
      <Col>
        <Alert color="danger mt-2">
          <ImPointRight className="icon" /> This is a project by{" "}
          <span className="fw-800">graduate students</span> who are attempting
          to <span className="fw-800">fulfill their degree requirements</span>{" "}
          and who are{" "}
          <span className="fw-800">
            eminently unqualified in the medical domain
          </span>
          . We understand that this is on the public internet but if you're not
          our friend, family member, or project sponsor, and have somehow
          stumbled here,{" "}
          <strong className="fw-800">
            you'd have to be very, very daft to use this resource for any
            medical advice
          </strong>
          . If you do, we are{" "}
          <strong className="fw-800">absolutely not liable</strong> for anything
          that may happen to you as a result of you employing this resource to
          inform any decision pertaining to your health.
        </Alert>

        <section className="mt-4">
          <h3 className="fw-600 my-3">
            <RiTeamLine className="icon" /> The Project
          </h3>

          <Row className="mt-5 mb-4">
            <Col className="text-center">
              <div className="team-member ">
                <img
                  src={Nikhil}
                  alt="Nikhil Anand"
                  className="rounded-circle"
                />
                <small className="d-block mt-3 text-muted">Nikhil Anand</small>
              </div>
            </Col>
            <Col className="text-center">
              <div className="team-member">
                <img
                  src={William}
                  alt="William Lam"
                  className="rounded-circle"
                />
                <small className="d-block mt-3 text-muted">William Lam</small>
              </div>
            </Col>
            <Col className="text-center">
              <div className="team-member">
                <img src={Shrea} alt="Shrea Shyam" className="rounded-circle" />
                <small className="d-block mt-3 text-muted">Shrea Shyam</small>
              </div>
            </Col>
          </Row>

          <p className="mt-5">
            We are graduate students at the Georgia Institute of Technology's{" "}
            <a href="https://www.analytics.gatech.edu/">
              Analytics &amp; Data Science Program
            </a>
            . Our project was sponsored by Ananth Venugopal and Shyamsree Nandi,
            some lovely folks at{" "}
            <a href="https://www.capgemini.com/us-en/">Capgemini</a>. This
            website is the result of an{" "}
            <span className="fw-600">"Applied Analytics Practicum"</span> where
            we attempt to prove to our University that we are worthy of being
            awarded a degree.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="fw-600 my-3">
            <ImLab className="icon" /> The Analysis
          </h3>
          <p>
            The long and short of it is: We used{" "}
            <span className="fw-600">
              Normalized Cosine Similarity matrices
            </span>{" "}
            to <TbCircle1 className="icon" /> find patients who share similar
            medical journeys, and <TbCircle2 className="icon" /> find conditions
            related to a given condition. We then used{" "}
            <span className="fw-600">
              Item-Item Similarity-Based Collaborative Filtering
            </span>{" "}
            to find conditions that a given patient had the greatest
            risk/potential of developing.
          </p>
          <p>
            We encourage you to{" "}
            <a href="/Report.pdf" className="fw-600">
              read our report
            </a>{" "}
            for a good overview of Recommendation Systems, their application to
            the problem we tried to solve, and the details and drawbacks of our
            implementation.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="fw-600 my-3">
            <TbBrandPython className="icon" /> The Code
          </h3>
          <p>
            You can find all our analyses and code for this website and its
            backend in our{" "}
            <a
              href="https://github.com/afreeorange/ISYE6748"
              title="Link to project repository on Github"
            >
              project's Github repository
            </a>
            . It's{" "}
            <a
              href="https://www.gnu.org/licenses/quick-guide-gplv3.html"
              title="Quick Guide to GNU GPLv3"
            >
              GNU GPLv3
            </a>{" "}
            licensed so go crazy! If you do improve this project, please send us
            a pull request. Thank you <TiHeartFullOutline className="icon" />
          </p>
        </section>

        <section className="mt-4">
          <h3 className="fw-600 my-3">
            <TbBrandCodepen className="icon" /> Other Stuff
          </h3>
          <p>
            This web application uses the the privacy-friendly{" "}
            <a href="https://plausible.io/">Plausible</a> for analytics (
            <a
              href="https://plausible.io/icd10.ninja/"
              title="Link to Plausible dashboard"
            >
              the dashboard is public
            </a>
            ) and does not set any cookies or use any creepy telemetry. It was
            developed using <a href="https://reactjs.org/">React</a> and{" "}
            <a href="https://flask.palletsprojects.com/en/2.2.x/">Flask</a> and
            is hosted by a popular cloud services provider.
          </p>
        </section>
      </Col>
    </Row>
  </div>
);

export default Component;
