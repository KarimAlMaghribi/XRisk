import {Typography} from "@mui/material";
import { Trans } from "react-i18next";

export const About = () => {
    return (
        <div>
            <br/>
            <br/>
            <div id="about">
            <Typography
                color="black" 
                variant="h4"
                style={{ marginLeft: "10px", marginRight: "10px" }}>
                <Trans i18nKey={"footer.about"} />
            </Typography>
            </div>
            <br/>
            <br/>
            <Typography
                color="black" 
                variant="h6"
                style={{ marginLeft: "10px", marginRight: "10px" }}>
                <Trans i18nKey={"footer.about_elements.our_mission"} />
            </Typography>
            <Typography
                variant="body1"
                component="p"
                style={{ marginLeft: "10px", marginRight: "400px" }}>
            <Trans i18nKey={"footer.about_elements.our_mission_text"} />
            </Typography>
            <br/>
            <br/>
            <Typography
                color="black" 
                variant="h6"
                style={{ marginLeft: "10px", marginRight: "10px" }}>
                <Trans i18nKey={"footer.about_elements.our_values"} />
            </Typography>
            <Typography
                variant="body1"
                component="p"
                style={{ marginLeft: "10px", marginRight: "400px" }}>
            <Trans i18nKey={"footer.about_elements.our_values_text"} />
            </Typography>
            <br/>
            <br/>
            <Typography
                color="black" 
                variant="h6"
                style={{ marginLeft: "10px", marginRight: "10px" }}>
                <Trans i18nKey={"footer.about_elements.our_team"} />
            </Typography>
            <Typography
                variant="body1"
                component="p"
                style={{ marginLeft: "10px", marginRight: "400px" }}>
            <Trans i18nKey={"footer.about_elements.our_team_text"} />
            </Typography>
            <br/>
            <br/>
            <Typography
                color="black" 
                variant="h6"
                style={{ marginLeft: "10px", marginRight: "10px" }}>
                <Trans i18nKey={"footer.about_elements.our_story"} />
            </Typography>
            <Typography
                variant="body1"
                component="p"
                style={{ marginLeft: "10px", marginRight: "400px" }}>
            <Trans i18nKey={"footer.about_elements.our_story_text"} />
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
      
