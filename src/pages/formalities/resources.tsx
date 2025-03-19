import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

function FooterResourceDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="resource">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.company"}></Trans>
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="help_center">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.help_center"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.resources_elements.help_center_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="blog">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.blog"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.resources_elements.blog_text"}></Trans>
        </Typography>
        <br/>
        <br/>
        <div id="tutorials">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.tutorials"}></Trans>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.resources_elements.tutorials_text"}></Trans>
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

export default FooterResourceDescriptions;
