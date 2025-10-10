import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { PublishedDetails } from "./published-details";
import { WithdrawnDetails } from "./withdrawn-details";
import { Trans } from "react-i18next";
import {Risk} from "../../../models/Risk";
import {Chat} from "../../../store/slices/my-bids/types";
import {selectChatsByRiskId} from "../../../store/slices/my-bids/selectors";
import {RiskStatusEnum} from "../../../enums/RiskStatus.enum";
import {AgreementDetails} from "./agreement-details/agreement-details";
import {DealDetails} from "./deals-details/deals-details";

export interface MyRiskRowDetailsProps {
  risk: Risk;
  taken?: boolean;
}

export const MyRiskRowDetails = (props: MyRiskRowDetailsProps) => {
  const riskRelatedChats: Chat[] = useSelector(selectChatsByRiskId(props.risk.id));

  const getRiskDetails = () => {
    switch (props.risk.status) {
      case RiskStatusEnum.PUBLISHED:
        return <PublishedDetails risk={props.risk} />;
      case RiskStatusEnum.WITHDRAWN:
        return <WithdrawnDetails risk={props.risk} />;
      case RiskStatusEnum.DEAL:
        return <DealDetails risk={props.risk} chats={riskRelatedChats} />;
      case RiskStatusEnum.AGREEMENT:
        return <AgreementDetails risk={props.risk} chats={riskRelatedChats} taken={props.taken} />;
      default:
        return null;
    }
  };

  return (
      <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 1, md: 1.5 }, width: "100%" }}>
        <Typography variant="h6" sx={{ mb: { xs: 1, md: 1.5 } }}>
          <Trans i18nKey="my_risks.details" />
        </Typography>
        <Box
            sx={{
              mt: { xs: 0.5, md: 1 },
              p: { xs: 1, sm: 1.5, md: 2 },
              borderRadius: { xs: 0, md: 1 },
              bgcolor: { xs: "transparent", md: "background.paper" },
            }}
        >
          {getRiskDetails()}
        </Box>
      </Box>
  );
};
