import { RiskStatusEnum } from "../../enums/RiskStatus.enum";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import DraftsIcon from "@mui/icons-material/Drafts";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import UndoIcon from "@mui/icons-material/Undo";
import { RiskStatus } from "../../types/RiskStatus";

import React from "react";
import { t, TFunction } from "i18next";

export const mapStatus = (t: TFunction, status: RiskStatusEnum | undefined) => {
  if (!status) return t("my_risks.unknown_status");

  switch (status) {
    case RiskStatusEnum.DRAFT:
      return t("my_risks.draft");
    case RiskStatusEnum.PUBLISHED:
      return t("my_risks.published");
    case RiskStatusEnum.AGREEMENT:
      return t("my_risks.done");
    case RiskStatusEnum.DEAL:
      return t("my_risks.under_negotiation");
    case RiskStatusEnum.WITHDRAWN:
      return t("my_risks.withdrawn");
  }
};

export const mapStatusIcon = (status: RiskStatusEnum | undefined) => {
  if (!status) return <QuestionMarkIcon />;

  switch (status) {
    case RiskStatusEnum.DRAFT:
      return <DraftsIcon />;
    case RiskStatusEnum.PUBLISHED:
      return <GroupsIcon />;
    case RiskStatusEnum.AGREEMENT:
      return <HandshakeIcon />;
    case RiskStatusEnum.DEAL:
      return <SportsKabaddiIcon />;
    case RiskStatusEnum.WITHDRAWN:
      return <UndoIcon />;
  }
};

export const mapStatusChipColor = (status: RiskStatus | undefined) => {
  switch (status) {
    case RiskStatusEnum.DRAFT:
      return "info";
    case RiskStatusEnum.PUBLISHED:
      return "success";
    case RiskStatusEnum.AGREEMENT:
      return "success";
    case RiskStatusEnum.DEAL:
      return "error";
    case RiskStatusEnum.WITHDRAWN:
      return "warning";
    default:
      return "primary";
  }
};

export const mapStatusToolTip = (
  t: TFunction,
  status: RiskStatus | undefined
) => {
  switch (status) {
    case RiskStatusEnum.DRAFT:
      return t("my_risks.draft_explanation");
    case RiskStatusEnum.PUBLISHED:
      return t("my_risks.published_explanation");
    case RiskStatusEnum.AGREEMENT:
      return t("my_risks.done_explanation");
    case RiskStatusEnum.DEAL:
      return t("my_risks.under_negotiation_explanation");
    case RiskStatusEnum.WITHDRAWN:
      return t("my_risks.withdrawn_explanation");
    default:
      return t("my_risks.unknown_status");
  }
};
