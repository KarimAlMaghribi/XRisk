import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

function FooterSolutionDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="solution">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.solutions"}></Trans>
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="brainstroming">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.brainstroming"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.solution_elements.brainstroming_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="ideation">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.ideation"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.solution_elements.ideation_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="wireframing">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.wireframing"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.solution_elements.wireframing_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="research">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.research"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.solution_elements.research_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
    </>
  );
}

export default FooterSolutionDescriptions;
