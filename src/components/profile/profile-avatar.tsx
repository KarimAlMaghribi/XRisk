// ProfileAvatar.tsx
import React, {useRef} from "react";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import {AvatarWithBadge} from "./avatar-with-badge-count";
import {auth} from "../../firebase_config";

export interface ProfileAvatarProps {
    imagePath: string;
    setImagePath: (imagePath: string) => void;
    file: File | null;
    setFile: (file: File | null) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            // Setze das File – der Upload wird nun in ProfileDialog per useEffect getriggert
            props.setFile(file);
            // Entferne die Erzeugung der temporären URL:
            // const tempUrl = URL.createObjectURL(file);
            // props.setImagePath(tempUrl);
        }
    };

    return (
        <>
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
                <AvatarWithBadge image={props.imagePath} alt="User Avatar" uid={auth?.currentUser?.uid}/>
            </Badge>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{display: "none"}}
                onChange={onFileChange}
            />
        </>
    );
};
