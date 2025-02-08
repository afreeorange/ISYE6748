import { PiDownloadDuotone } from "react-icons/pi";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { H1, H2, ICDCode } from "../shared/components";

const DiseaseClassification = () => {
  return (
    <div className="overflow-x-auto ">
      <table className="icd-table">
        <thead>
          <tr>
            <th>Diagnosis</th>
            <th className="w-28">ICD10 Code</th>
            <th className="w-16">Layer</th>
            <th className="w-48">Label</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Diseases of the digestive system</td>
            <td>
              <ICDCode>K00-K95</ICDCode>
            </td>
            <td>1</td>
            <td>Very Broad Condition</td>
          </tr>
          <tr>
            <td>
              <MdOutlineSubdirectoryArrowRight className="inline" />{" "}
              Noninfective enteritis & colitis
            </td>
            <td>
              <ICDCode>K50-K52</ICDCode>
            </td>
            <td>2</td>
            <td>Broad Condition</td>
          </tr>
          <tr>
            <td>
              <MdOutlineSubdirectoryArrowRight className="inline ml-4" /> Other
              & unspecified noninfective gastroenteritis & colitis
            </td>
            <td>
              <ICDCode>K52</ICDCode>
            </td>
            <td>3</td>
            <td>Specific Condition</td>
          </tr>
          <tr>
            <td>
              <MdOutlineSubdirectoryArrowRight className="inline ml-8" /> Other
              specified noninfective gastroenteritis & colitis
            </td>
            <td>
              <ICDCode>K52.8</ICDCode>
            </td>
            <td>4</td>
            <td>&hellip;</td>
          </tr>
          <tr>
            <td>
              <MdOutlineSubdirectoryArrowRight className="inline ml-12" />{" "}
              Microscopic colitis
            </td>
            <td>
              <ICDCode>K52.83</ICDCode>
            </td>
            <td>5</td>
            <td>&hellip;</td>
          </tr>
          <tr>
            <td>
              <MdOutlineSubdirectoryArrowRight className="inline ml-16" />{" "}
              Lymphocytic colitis
            </td>
            <td>
              <ICDCode>K52.832</ICDCode>
            </td>
            <td>6</td>
            <td>&hellip;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Data = () => (
  <div className="prose">
    <H1>Data</H1>
    <p>
      This project uses two primary sources of data: raw datasets of patient
      records (medical and pharmaceutical claims) from our sponsor and{" "}
      <a
        href="https://www.cms.gov/medicare/coordination-benefits-recovery/overview/icd-code-lists"
        title="View various diagnostic codes on the Centers for Medicare & Medical Services' website"
        className="link"
      >
        ICD10 Diagnostic Codes from the Centers for Medicare & Medical Services
      </a>
      . You may view the raw data and our transformations in{" "}
      <a
        href="https://github.com/afreeorange/ISYE6748"
        title="Our project's source code on Github"
        className="link"
      >
        our project's Github repository
      </a>
      .
    </p>
    <p>
      ICD10 Codes are a disease classification taxonomy developed and maintained
      by the World Health Organization. As of 2023, there are 73,639 of them and
      they are organized into hierarchies.{" "}
    </p>
    <p>
      {" "}
      The table below shows where a diagnosis like "Microscopic colitis" lies in
      the ICD10 hierarchy, our own assignment of a{" "}
      <strong className="font-semibold">layer number</strong> to this hierarchy,
      and what we're <strong className="font-semibold">label</strong>ing each
      layer number for ease of interpretation. Our models only go up to Layer
      &#9314; You are encouraged to{" "}
      <strong className="font-semibold">
        <a
          href="/report.pdf"
          title="Read our project report in PDF format"
          className="link"
        >
          read our report
        </a>
      </strong>{" "}
      for a further overview of the ICD10 system and how we utilized it in our
      project.
    </p>
    <DiseaseClassification />

    <H2>JSON Metadata</H2>
    <p>
      You can view the ICD10 Layer mappings and metadata we use to power our
      models and this website below.
    </p>
    <ul className="md:flex md:justify-evenly md:my-8 my-6">
      <li className="text-lg flex gap-1.5">
        <div>
          &#9312; <PiDownloadDuotone className="block mr-2" />
        </div>
        <div>
          <a
            href="/layer_1.json"
            title="View Layer One JSON file"
            className="link"
          >
            Layer One
          </a>{" "}
          <br />
          <span className="text-sm block opacity-30">
            Very Broad Conditions
          </span>
        </div>
      </li>
      <li className="text-lg flex gap-1.5">
        <div>
          &#9313; <PiDownloadDuotone className="block mr-2" />
        </div>
        <div>
          <a
            href="/layer_2.json"
            title="View Layer Two JSON file"
            className="link"
          >
            Layer Two
          </a>{" "}
          <span className="text-sm block opacity-30">Broad Conditions</span>
        </div>
      </li>
      <li className="text-lg flex gap-1.5">
        <div>
          &#9314;
          <PiDownloadDuotone className="block mr-2" />
        </div>
        <div>
          <a
            href="/layer_3.json"
            title="View Layer Three JSON file"
            className="link"
          >
            Layer Three
          </a>{" "}
          <span className="text-sm block opacity-30">Specific Conditions</span>
        </div>
      </li>
    </ul>
    <p>
      You can also view all the ICD10 disease conditions we used in our model as{" "}
      <a
        href="/all_layers_map.json"
        title="View all layers as a map"
        className="link"
      >
        a map
      </a>{" "}
      or as{" "}
      <a
        href="/all_layers_list.json"
        title="View all layers as a list"
        className="link"
      >
        a list
      </a>
      .
    </p>
  </div>
);

export default Data;
