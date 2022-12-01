import { useContext } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import { GrPowerReset } from "react-icons/gr";
import { ImLab } from "react-icons/im";

import { StateContext } from "../state/Provider";
import services from "../services/api";
import { AxiosError } from "axios";

export const LAYER_SEARCH_RESULT_LIMIT = 25;

const Component: React.FC = () => {
  const {
    existingPatientSearchTerm,
    existingPatientSearchState,
    setExistingPatientSearchTerm,
    setExistingPatientSearchState,
    setExistingPatientSearchResults,
  } = useContext(StateContext)!;

  const handleChange = (term: string) => {
    /**
     * This may be wasteful but but I don't care at this point. It's 'fast
     * enough' and I'm not sure how much faster it can be.
     */
    const filteredTerm = term
      .split("")
      .map((_) => Number.parseInt(_))
      .filter((_) => !Number.isNaN(_))
      .join("");

    setExistingPatientSearchTerm(filteredTerm);
  };

  const handleSubmit = async () => {
    setExistingPatientSearchState("processing");

    try {
      setExistingPatientSearchResults(
        await services.patient.existing.similarTo(existingPatientSearchTerm!)
      );
      setExistingPatientSearchState("processed");
    } catch (e: unknown) {
      if ((e as AxiosError).response?.status === 404) {
        let { data } = (e as AxiosError).response!;

        if ((data as string).includes("not in list")) {
          setExistingPatientSearchState("error");
          setExistingPatientSearchResults({
            recommendedConditions: null,
            thisPatient: null,
            similarPatients: null,
          });

          return;
        }

        setExistingPatientSearchState("processed");
        setExistingPatientSearchResults(null);
      } else {
        setExistingPatientSearchState("error");
      }
    }
  };

  const handleReset = () => {
    setExistingPatientSearchTerm(null);
    setExistingPatientSearchState("idle");
  };

  return (
    <>
      <Row>
        <Col lg={existingPatientSearchTerm ? 10 : undefined}>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                autoFocus
                placeholder="Enter a Member Life ID you know (e.g. 154, 428, 3140, 4884)"
                type={"search"}
                value={existingPatientSearchTerm || ""}
                onChange={(e) => handleChange(e.target.value)}
              />

              {!existingPatientSearchTerm && (
                <FormText className="text-muted-more">
                  All IDs are numbers. No letters allowed!
                </FormText>
              )}
            </FormGroup>
          </Form>
        </Col>
        {existingPatientSearchTerm && (
          <Col>
            <Button
              color="warning"
              className="w-100"
              onClick={() => handleReset()}
              disabled={!existingPatientSearchTerm}
            >
              <GrPowerReset className="icon" /> Reset
            </Button>
          </Col>
        )}
      </Row>
      {existingPatientSearchTerm && (
        <Row>
          <Col>
            <Button
              color="success"
              className="w-100"
              onClick={() => handleSubmit()}
            >
              {existingPatientSearchState === "processing" ? (
                <Spinner size={"sm"} />
              ) : (
                <span>
                  <ImLab className="icon" /> <strong>Examine Journey</strong>
                </span>
              )}
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Component;
