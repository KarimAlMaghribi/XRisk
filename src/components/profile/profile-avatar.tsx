import React, { useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";

export const ProfileAvatar = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            console.log("Uploaded file:", file);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            badgeContent={
                <EditIcon
                    onClick={triggerFileInput}
                    sx={{
                        width: 25,
                        height: 25,
                        backgroundColor: "secondary.main",
                        borderRadius: "50%",
                        padding: "2px",
                        color: "white",
                        boxShadow: 1,
                        cursor: "pointer",

                        "&:hover": {
                            backgroundColor: "white",
                            color: "secondary.main",
                        },
                    }}
                />
            }
        >
            <Avatar
                sx={{ width: 100, height: 100 }}
                src="/path-to-your-avatar.jpg"
                alt="User Avatar"
            />

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
            />
        </Badge>
    );
};
