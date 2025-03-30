import React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

export interface AvatarWithBadgeProps {
    image: string;
    alt?: string;
    avatarSize?: number;
    uid?: string | null;
}

export const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
    image,
    alt = "Avatar",
    avatarSize = 100,
    uid,
}) => {
    const calcSuccessfulTransfers = () => {
        return 1;
    }

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            badgeContent={
                <Tooltip
                    placement="top"
                    title="Anzahl erfolgreich abgeschlossener Risikotransfers"
                    sx={{pointer: "cursor"}}>
                    <Typography
                        variant="caption"
                        sx={{
                            cursor: "pointer",
                            backgroundColor: "primary.main",
                            color: "white",
                            borderRadius: "50%",
                            padding: "2px 4px",
                            fontSize: "0.75rem",
                            lineHeight: 1,
                        }}>
                        {
                            uid ? calcSuccessfulTransfers() : " -- "
                        }
                    </Typography>
                </Tooltip>
            }>
            <Avatar sx={{ width: avatarSize, height: avatarSize }} src={image} alt={alt} />
        </Badge>
    );
};
