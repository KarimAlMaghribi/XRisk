import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

function FooterSupportDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="support">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.support"}></Trans>
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="developers">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.developers"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.support_elements.developers_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="documentation">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.documentation"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.support_elements.documentation_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="integrations">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.integrations"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.support_elements.integrations_text"}></Trans>
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

export default FooterSupportDescriptions;
