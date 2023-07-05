import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import { ClipLoader } from "react-spinners";
import { useMediaQuery } from "@mui/material";
import { styles } from "./ChangeProfilePicStyles";

export default function ChangeProfilePic() {
  const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const is4K = useMediaQuery("(min-width: 3840px)");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const file = selectedFile;
    const formData = new FormData();
    if (file) {
      formData.append("AvatarFile", file);
    }
    axios
      .post("http://localhost:5001/api/account/updateProfilePic", formData)
      .then((response) => {
        const profilePictureUrl = response.data.profilePictureUrl;
        dispatch({
          type: "account/setUser",
          payload: {
            ...user,
            profilePictureUrl,
          },
        });
      })
      .catch((error) => {
        console.error("Error updating profile picture:", error);
      })
      .finally(() => {
        setLoading(false);
        setSelectedFile(null);
      });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CameraAltIcon
        sx={{
          fill: "black",
          backgroundColor: "#c76c01",
          borderRadius: "50%",
          fontSize: is4K ? 55 : 30,
          padding: "3px",
        }}
        className={styles.cameraIcon}
        onClick={() => document.getElementById("fileUpload")!.click()}
      />
      <input
        type="file"
        id="fileUpload"
        name="AvatarFile"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className={styles.selectedFileWrapper}>
        {selectedFile && (
          <div className={styles.selectedFile}>
            <p className="overflow-hidden bg-gray-800 rounded-md">
              {selectedFile && selectedFile.name}
            </p>
            <div className={styles.clearIconWrapper}>
              <span
                onClick={() => setSelectedFile(null)}
                className="cursor-pointer"
              >
                <ClearIcon sx={{ fill: "red" }} />
              </span>
              <span className={styles.sendButton}>
                {!loading ? (
                  <SendIcon
                    sx={{ fill: "black", fontSize: 18 }}
                    onClick={() => document.getElementById("sendImg")!.click()}
                  />
                ) : (
                  <ClipLoader color="#fff" />
                )}
              </span>
            </div>
          </div>
        )}
        <button type="submit" id="sendImg" className="hidden">
          
        </button>
      </div>
    </form>
  );
}
