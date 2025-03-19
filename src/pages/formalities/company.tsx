import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

function FooterCompanyDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="company">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.company"}></Trans>
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="press">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.press"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.company_elements.press_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="events">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.events"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.company_elements.events_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="request_demo">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.request_demo"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.company_elements.request_demo_text"}></Trans>
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

export default FooterCompanyDescriptions;
