import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

function FooterProductDescriptions() {
  return (
    <>
        <br/>
        <br/>
        <div id="product">
        <Typography
            color="black" 
            variant="h4"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.product"}/>
        </Typography>
        </div>
        <br/>
        <br/>
        <div id="price">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.pricing"}/>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.product_elements.pricing_text"}/>
        </Typography>
        <br/>
        <br/>
        <div id="overview">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.overview"}/>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.product_elements.overview_text"}/>
        </Typography>
        <br/>
        <br/>
        <div id="browse">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.browse"}/>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.product_elements.browse_text"}/>
        </Typography>
        <br/>
        <br/>
        <div id="accessibility">
        <Typography
            color="black" 
            variant="h6"
            style={{ marginLeft: "10px", marginRight: "10px" }}>
            <Trans i18nKey={"footer.accessibility"}/>
        </Typography>
        </div>
        <Typography
            variant="body1"
            component="p"
            style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.product_elements.accessibility_text"}/>
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

export default FooterProductDescriptions;
