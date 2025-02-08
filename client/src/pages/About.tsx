import {
  PiBookOpenTextDuotone,
  PiHandHeartDuotone,
  PiHandPointingDuotone,
  PiPresentationChartDuotone,
} from "react-icons/pi";
import { H1, H2 } from "../shared/components";

const Author: React.FC<{
  name: string;
  src: string;
}> = ({ name, src }) => (
  <div>
    <img
      className="w-48 h-48 rounded-badge border p-2"
      src={src}
      alt={`Photo of ${name}`}
    />
    <p className="block md:text-center mt-4 md:text-sm">{name}</p>
  </div>
);

const About = () => (
  <div className="prose">
    <H1>About</H1>
    <H2>Disclaimer</H2>
    <div className="md:flex md:gap-2">
      <PiHandPointingDuotone className="inline rotate-90 mr-1 text-red-500 md:w-32 md:h-8" />
      <div className="inline">
        This is a project by graduate students who are attempting to fulfill
        their degree requirements and who are eminently unqualified in the
        medical domain. We understand that this is on the public internet but if
        you're not our friend, family member, or project sponsor, and have
        somehow stumbled here,{" "}
        <strong className="font-semibold">
          you'd have to be very daft to use this resource for any medical advice
        </strong>
        . If you do,{" "}
        <strong className="font-semibold">
          we are absolutely not liable for anything that may happen to you
        </strong>{" "}
        as a result of you employing this resource to inform any decision
        pertaining to your health.
      </div>
    </div>
    <H2>Authors</H2>
    <div className="md:flex md:justify-evenly mb-4 mt-12">
      <Author name="Nikhil Anand" src="/nikhil.jpg" />
      <Author name="William Lam" src="/william.jpg" />
      <Author name="Shrea Shyam" src="/shrea.jpg" />
    </div>
    <p>
      We are graduate students at the Georgia Institute of Technology's{" "}
      <a
        className="link"
        href="https://www.analytics.gatech.edu/"
        title="The Georgia Tech Analytics Program"
      >
        Analytics & Data Science Program
      </a>
      . Our project was sponsored by Ananth Venugopal and Shyamsree Nandi at{" "}
      <a
        className="link"
        href="https://www.capgemini.com/us-en/"
        title="The Capgemini Website"
      >
        Capgemini
      </a>
      . This website is the result of an “Applied Analytics Practicum” where we
      attempt to prove to our University that we are worthy of being awarded a
      degree.
    </p>
    <p>
      The long and short of it is: We used{" "}
      <strong className="font-semibold">
        Normalized Cosine Similarity matrices
      </strong>{" "}
      to &#9312; find patients who share similar medical journeys, and &#9313;
      find conditions related to a given condition. We then used{" "}
      <strong className="font-semibold">
        Item-Item Similarity-Based Collaborative Filtering
      </strong>{" "}
      to find conditions that a given patient had the greatest risk of
      developing.
    </p>
    <p>
      We provide a a good overview of Recommendation Systems, their application
      to the problem we tried to solve, and the details and drawbacks of our
      implementation in our report.
    </p>
    <div className="mt-8 mx-auto max-w-96 text-center">
      <a
        href="/report.pdf"
        className="btn btn-success text-white text-xl btn-lg w-full"
      >
        <PiBookOpenTextDuotone className="text-4xl mr-2" /> Read Our Final
        Report
      </a>

      <a
        href="/midterm-report.pdf"
        className="btn btn-success btn-outline text-lg mt-4 w-full"
      >
        <PiPresentationChartDuotone className="text-2xl mr-2" /> See Our Midterm
        Presentation
      </a>
    </div>

    <H2>Code</H2>
    <p>
      You can find all our analyses and code for this website and its backend in
      our{" "}
      <a
        className="link"
        href="https://github.com/afreeorange/ISYE6748"
        title="Link to project repository on Github"
      >
        project's Github repository
      </a>
      . It's{" "}
      <a
        className="link"
        href="https://www.gnu.org/licenses/quick-guide-gplv3.html"
        title="Quick Guide to GNU GPLv3"
      >
        GNU GPLv3
      </a>{" "}
      licensed so if you start hacking this project, please send us a pull
      request. Thank you <PiHandHeartDuotone className="inline" />
    </p>

    <H2>Other Stuff</H2>
    <p>
      This website uses the privacy-friendly{" "}
      <a
        className="link"
        href="https://plausible.io/"
        title="Plausible: Privacy-friendly analytics"
      >
        Plausible
      </a>{" "}
      for analytics (
      <a
        className="link"
        href="https://plausible.io/icd10.ninja/"
        title="Link to Plausible dashboard"
      >
        the dashboard is public
      </a>
      ) and does not set any cookies or use any creepy telemetry. It was
      developed using{" "}
      <a
        className="link"
        href="https://reactjs.org/"
        title="React Documentation"
      >
        React
      </a>{" "}
      and{" "}
      <a
        className="link"
        title="Flask Documentation"
        href="https://flask.palletsprojects.com/en/2.2.x/"
      >
        Flask
      </a>{" "}
      and is hosted by a popular cloud services provider.
    </p>
  </div>
);

export default About;
