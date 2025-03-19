import { Typography } from "@mui/material";
import { Trans } from "react-i18next";

export const TermsPage = () => {
        return (
            <div>
              <br/>
              <br/>
              <div id="terms">
              <Typography
                  color="black" 
                  variant="h4"
                  style={{ marginLeft: "10px", marginRight: "10px" }}>
                  <Trans i18nKey={"footer.terms_fullform"} />
              </Typography>
              </div>
              <br/>
              <br/>
              <Typography
                  color="black" 
                  variant="h6"
                  style={{ marginLeft: "10px", marginRight: "10px" }}>
                  1. <Trans i18nKey={"footer.terms_elements.scope_of_application"} />
              </Typography>
              <Typography
                  variant="body1"
                  component="p"
                  style={{ marginLeft: "10px", marginRight: "400px" }}>
                <Trans i18nKey={"footer.terms_elements.scope_text"} />
              </Typography>
              <br/>
              <br/>
              <Typography
                  color="black" 
                  variant="h6"
                  style={{ marginLeft: "10px", marginRight: "10px" }}>
                  2. <Trans i18nKey={"footer.terms_elements.subject_matter"} />
              </Typography>
              <Typography
                  variant="body1"
                  component="p"
                  style={{ marginLeft: "10px", marginRight: "400px" }}>
                <Trans i18nKey={"footer.terms_elements.subject_matter_text"} />
              </Typography>
              <br/>
              <br/>
              <Typography
                  color="black" 
                  variant="h6"
                  style={{ marginLeft: "10px", marginRight: "10px" }}>
                  3. <Trans i18nKey={"footer.terms_elements.obligations_parties"} />
              </Typography>
              <Typography
                  variant="body1"
                  component="p"
                  style={{ marginLeft: "10px", marginRight: "400px" }}>
                <Trans i18nKey={"footer.terms_elements.obligations_parties_text"} />
              </Typography>
              <br/>
              <br/>
              <Typography
                  color="black" 
                  variant="h6"
                  style={{ marginLeft: "10px", marginRight: "10px" }}>
                  4. <Trans i18nKey={"footer.terms_elements.disclaimer"} />
              </Typography>
              <Typography
                  variant="body1"
                  component="p"
                  style={{ marginLeft: "10px", marginRight: "400px" }}>
                <Trans i18nKey={"footer.terms_elements.disclaimer_text"} />
              </Typography>
              <br/>
              <br/>
              <Typography
                  color="black" 
                  variant="h6"
                  style={{ marginLeft: "10px", marginRight: "10px" }}>
                  5. <Trans i18nKey={"footer.terms_elements.final_provisions"} />
              </Typography>
              <Typography
                  variant="body1"
                  component="p"
                  style={{ marginLeft: "10px", marginRight: "400px" }}>
                <Trans i18nKey={"footer.terms_elements.final_provision_text"} />
              </Typography>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div>
          );
  }
  