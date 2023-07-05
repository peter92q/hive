import { BlogPostDto, CommentResponseDto } from "../../Configs/Types/Types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCurrentComment } from "../../Configs/Redux/post";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import { SetStateAction } from "react";

export default function CommentsWindow({
  comment,
  index,
  postsList,
  setPostsList,
  postIndex,
}: {
  comment: CommentResponseDto;
  index: number;
  postsList: BlogPostDto[];
  setPostsList: React.Dispatch<SetStateAction<BlogPostDto[] | null>>;
  postIndex: number | null;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);

  async function deleteComment(
    postId: number,
    commentId: number,
    index: number
  ) {
    const result = await axios.delete(
      `blogposts/${postId}/comments/${commentId}`
    );
    console.log(result.data);
    const updatedPosts = [...postsList!];
    updatedPosts[postIndex!].comments.splice(index, 1);
    updatedPosts[postIndex!].commentsCount -= 1;
    setPostsList(updatedPosts);
    dispatch(
      deleteCurrentComment({
        postId: postsList![postIndex!].id,
        commentId: commentId,
      })
    );
  }
  return (
    <>
      <div
        className="text-white text-[13px] border-b-[1px] border-yellow-700/30 pt-1 pb-1"
        key={`${comment.id}-${index}`}
      >
        <div>
          <div className="flex flex-row justify-between px-1 pt-[3px]">
            <div className="flex flex-row gap-1">
              <img
                src={comment.authorProfilePic}
                className="w-8 h-8"
                alt="profilePic"
              />
              {comment.authorUsername}
            </div>
            {comment.createdAt}
          </div>
        </div>

        <div className="flex flex-row justify-between px-[1px]">
          <div className="px-1">{comment.text}</div>
          <div>
            {comment.authorUsername === user?.username && (
              <DeleteForeverIcon
                onClick={() =>
                  deleteComment(postsList[postIndex!].id, comment.id, index)
                }
                className="hover:bg-gray-500/40 cursor-pointer rounded-full"
                sx={{ fill: "red", fontSize: 20 }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
