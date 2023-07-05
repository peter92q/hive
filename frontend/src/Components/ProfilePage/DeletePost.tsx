import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useAppDispatch } from "../../Configs/Redux/store";
import axios from "axios";
import { deleteCurrentPost } from "../../Configs/Redux/post";
import { BlogPostDto } from "../../Configs/Types/Types";
import { SetStateAction, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Slide, ClickAwayListener } from "@mui/material";

export default function DeletePost({
  postsList,
  setPostsList,
  postId,
}: {
  postsList: BlogPostDto[] | null;
  setPostsList: React.Dispatch<SetStateAction<BlogPostDto[] | null>>;
  postId: number;
}) {
  const dispatch = useAppDispatch();

  const [confirm, setConfirm] = useState(false);

  async function deletePost(id: number) {
    const response = await axios.delete(`BlogPosts/${id}`);
    console.log(response.data);
    const updatedPosts = [...postsList!];
    const filter = updatedPosts.filter((post) => post.id !== id);
    setPostsList(filter);
    dispatch(deleteCurrentPost({ postId: id }));
  }

  return (
    <>
      <div
        onClick={() => setConfirm(true)}
        className=" text-white flex items-end justify-end
                      translate-y-[25px] px-1
                      "
        >
        <DeleteOutlineIcon
          sx={{
            fill: "white",
            fontSize: 20,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#1e293b",
              borderRadius: "50%",
            },
          }}
        />
      </div>

      {confirm && (
        <ClickAwayListener onClickAway={() => setConfirm(false)}>
          <Slide direction="right" in={confirm} timeout={400} unmountOnExit>
            <div
              className="text-white flex flex-row gap-2 lg:gap-5 border-[1px]
               border-yellow-700/50 px-1absolute mt-5 bg-black items-center 
               justify-center z-20"
            >
              <p className="text-[13px] lg:text-[20px]">Delete post?</p>
              <CheckIcon
                onClick={() => {
                  deletePost(postId);
                  setConfirm(false);
                }}
                sx={{
                  fill: "green",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#1e293b",
                    borderRadius: "50%",
                  },
                }}
              />
              <CloseIcon
                onClick={() => setConfirm(false)}
                sx={{
                  fill: "red",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#1e293b",
                    borderRadius: "50%",
                  },
                }}
              />
            </div>
          </Slide>
        </ClickAwayListener>
      )}
    </>
  );
}
