import React, {useRef} from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";

export interface ProfileAvatarProps {
    imagePath: string;
    setImagePath: (imagePath: string) => void;
    file: File | null;
    setFile: (file: File) => void;
}

export const ProfileAvatar = (props: ProfileAvatarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            props.setFile(file);
            console.log(file);

            const tempUrl = URL.createObjectURL(file);
            props.setImagePath(tempUrl);
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
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                        padding: "2px",
                        color: "white",
                        boxShadow: 1,
                        cursor: "pointer",

                        "&:hover": {
                            backgroundColor: "white",
                            color: "primary.main",
                        },
                    }}
                />
            }
        >
            <Avatar
                sx={{width: 100, height: 100}}
                src={props.imagePath}
                alt="User Avatar"
            />

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{display: "none"}}
                onChange={onFileChange}
            />
        </Badge>
    );
};

