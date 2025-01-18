import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import {auth, storage} from "../../firebase_config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface ProfileAvatarProps {
    imagePath?: string;
}

export const ProfileAvatar = (props: ProfileAvatarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageSrc, setImageSrc] = useState<string>(props.imagePath || "");

    const handleFileUpload = async (file: File) => {
        const user = auth.currentUser;

        if (!user) {
            console.error("Benutzer nicht authentifiziert");
            return;
        }

        const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            console.log("Datei hochgeladen:", snapshot.metadata);

            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log("Download-URL:", downloadURL);
            setImageSrc(downloadURL);
        } catch (error) {
            console.error("Fehler beim Hochladen:", error);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            await handleFileUpload(file);
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
                sx={{ width: 100, height: 100 }}
                src={imageSrc}
                alt="User Avatar"
            />

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileChange}
            />
        </Badge>
    );
};
