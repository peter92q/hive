import React, { SetStateAction, useState } from "react";
import { addCommentToPost } from "../../Configs/Redux/post";
import { useAppDispatch } from "../../Configs/Redux/store";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { BlogPostDto } from "../../Configs/Types/Types";

export default function SubmitComment({
  postsList,
  setPostsList,
  postIndex,
}: {
  postsList: BlogPostDto[] | null;
  setPostsList: React.Dispatch<SetStateAction<BlogPostDto[] | null>>;
  postIndex: number | null;
}) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  async function submitComment(event: any) {
    event.preventDefault();
    setLoading(true);
    const text = event.target.text.value;
    const response = await axios.post(
      `/blogposts/${postsList![postIndex!].id}/createComment`,
      {
        text: text,
      }
    );
    const newComment = response.data;
    const updatedPosts = [...postsList!];
    updatedPosts[postIndex!].comments.push(newComment);
    updatedPosts[postIndex!].commentsCount += 1;
    setPostsList(updatedPosts);
    setLoading(false);
    dispatch(
      addCommentToPost({
        postId: postsList![postIndex!].id,
        comment: newComment,
      })
    );
  }

  return (
    <form onSubmit={submitComment} className="w-full">
      <div className="relative my-1 pb-1 px-1">
        <input
          placeholder="Write a comment..."
          type="text"
          name="text"
          className="bg-gray-800 w-full text-white
             rounded-md px-2 py-1 outline-0 border-[1px] border-transparent focus:border-yellow-600"
        />
        <button
          type="submit"
          className="absolute hover:opacity-80 text-[16px] 
        top-0 right-0 mr-2 mt-[4px]
         py-[1px] bg-yellow-700 px-1 rounded-md min-w-[65px]"
        >
          {loading ? (
            <ClipLoader color="#fff" size={15} />
          ) : (
            <p className="translate-y-[-1px]">Submit</p>
          )}
        </button>
      </div>
    </form>
  );
}
