import React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {useAgreedRisks} from "./use-agreed-risks";

export interface AvatarWithBadgeProps {
    image: string | undefined;
    alt?: string;
    avatarSize?: number;
    uid?: string | null;
    badgeSize?: {x: number, y: number};
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    name?: string;
}

export const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
    image,
    alt = "Avatar",
    avatarSize = 100,
    uid,
    badgeSize = {x: 4, y: 6},
    onClick,
    name
}) => {
    const { risks, loading, error } = useAgreedRisks(uid);

    const calcSuccessfulTransfers = () => {
        return risks.length;
    }

    const badgeHover: string = name
        ? `${name} hat ${calcSuccessfulTransfers()} erfolgreiche Risiko-Transfers abgeschlossen`
        : "Anzahl abgeschlossener Risikotransfer";

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            badgeContent={
                <Tooltip
                    placement="top"
                    followCursor
                    title={badgeHover}
                    sx={{pointer: "cursor"}}>
                    <Typography
                        variant="caption"
                        sx={{
                            cursor: "pointer",
                            backgroundColor: "primary.main",
                            color: "white",
                            borderRadius: "50%",
                            padding: `${badgeSize.x}px ${badgeSize.y}px` ,
                            fontSize: "0.75rem",
                            lineHeight: 1,
                        }}>
                        {
                            !loading && !error && uid ? calcSuccessfulTransfers() : " -- "
                        }
                    </Typography>
                </Tooltip>
            }>
            <Tooltip title={name} followCursor placement="top">
                <Avatar sx={{ width: avatarSize, height: avatarSize }} src={image} alt={alt} onClick={onClick}/>
            </Tooltip>
        </Badge>
    );
};
