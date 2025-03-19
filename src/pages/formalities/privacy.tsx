import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
export const Privacy = () => {
  return (
      <div>
          <br/>
          <br/>
          <div id="privacy">
          <Typography
              color="black" 
              variant="h4"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              <Trans i18nKey={"footer.privacy_elements.data_protection"}/>
          </Typography>
          </div>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              <Trans i18nKey={"footer.privacy_elements.introduction"}/>
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
            <Trans i18nKey={"footer.privacy_elements.intro_line_1"}/>
          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              <Trans i18nKey={"footer.privacy_elements.second_paragraph"}/>
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
            <Trans i18nKey={"footer.privacy_elements.sec_par_line_1"}/>
          <ul>
              <li><Trans i18nKey={"footer.privacy_elements.sec_par_line_1_1"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.sec_par_line_1_2"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.sec_par_line_1_3"}/></li>

          </ul>

          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              <Trans i18nKey={"footer.privacy_elements.third_paragraph"}/>
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.privacy_elements.thrd_par_line_1"}/>
          <ul>
              <li><Trans i18nKey={"footer.privacy_elements.thrd_par_line_1_1"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.thrd_par_line_1_2"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.thrd_par_line_1_3"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.thrd_par_line_1_4"}/></li>
          </ul>
          <Trans i18nKey={"footer.privacy_elements.thrd_par_line_2"}/>
          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              <Trans i18nKey={"footer.privacy_elements.fourth_paragraph"}/>
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.privacy_elements.fourth_par_line_1"}/>
          </Typography>
          <br/>
          <br/>
          <Typography
              color="black" 
              variant="h6"
              style={{ marginLeft: "10px", marginRight: "10px" }}>
              <Trans i18nKey={"footer.privacy_elements.fifth_paragraph"}/>
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{ marginLeft: "10px", marginRight: "400px" }}>
          <Trans i18nKey={"footer.privacy_elements.fifth_par_line_1"}/>
          <ul>
              <li><Trans i18nKey={"footer.privacy_elements.fifth_par_line_1_1"}/> </li>
              <li><Trans i18nKey={"footer.privacy_elements.fifth_par_line_1_2"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.fifth_par_line_1_3"}/></li>
              <li><Trans i18nKey={"footer.privacy_elements.fifth_par_line_1_4"}/></li>
          </ul>
          <Trans i18nKey={"footer.privacy_elements.fifth_par_line_2"}/>
          </Typography>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
      </div>
      )
}

export default Privacy;
