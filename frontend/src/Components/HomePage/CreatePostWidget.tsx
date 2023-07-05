import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import { addNewPost } from "../../Configs/Redux/post";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ClearIcon from "@mui/icons-material/Clear";
import { styles } from "./CreatePostWidgetStyles";

export default function CreatePostWidget() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const file = event.target.file.files[0];
    const description = event.target.description.value;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/blogposts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newPost = response.data;
      dispatch(addNewPost(newPost));
      setSelectedFile(null);
      event.target.description.value = null;
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <div className={styles.mainContainer}>
      <form onSubmit={handleSubmit} className="w-full overflow-x-hidden">
        <div className={styles.avatarInputWrapper}>
          {!user ? (
            <AccountCircleIcon
              sx={{
                fill: "gray",
                height: "35px",
                width: "35px",
                marginRight: "5px",
              }}
            />
          ) : (
            <img
              src={user.profilePictureUrl}
              alt="profilePic"
              className={styles.avatar}
            />
          )}
          <input
            className={styles.input}
            placeholder="What's on your mind?"
            type="text"
            id="description"
            name="description"
          />

          <div className={styles.sendButton}>
            {!loading ? (
              <SendIcon
                sx={{ fill: "black", fontSize: 22 }}
                onClick={() => document.getElementById("submitbtn")!.click()}
              />
            ) : (
              <ClipLoader color="#fff" />
            )}
          </div>
          <CameraAltIcon
            className={styles.cameraIcon}
            sx={{ fill: "black", fontSize: 32 }}
            onClick={() => document.getElementById("fileUpload")!.click()}
          />
        </div>
        <span className="ml-2 mt-1 text-white">
          {selectedFile && selectedFile.name}
        </span>
        {selectedFile && (
          <span
            onClick={() => setSelectedFile(null)}
            className="ml-2 cursor-pointer"
          >
            <ClearIcon sx={{ fill: "red" }} />
          </span>
        )}
        <input
          type="file"
          id="fileUpload"
          name="file"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button type="submit" id="submitbtn" className="hidden">
          Submit
        </button>
      </form>
    </div>
  );
}
