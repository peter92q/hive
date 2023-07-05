import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import axios from "axios";
import { likePost } from "../../Configs/Redux/post";
import { useAppDispatch } from "../../Configs/Redux/store";
import { BlogPostDto } from "../../Configs/Types/Types";
import { SetStateAction } from "react";

export default function PostLike(
    {
        postsList,
        setPostsList,
        postIndex,
      }: {
        postsList: BlogPostDto[] | null;
        setPostsList: React.Dispatch<SetStateAction<BlogPostDto[] | null>>;
        postIndex: number | null;
      }
) {
    const dispatch = useAppDispatch();

    async function likeCurrentPost()
    {
      const result = await axios.post(`/BlogPosts/${postsList![postIndex!].id}/like`);
      console.log(result.data);
      const updatedPosts = [...postsList!];
      updatedPosts[postIndex!].isLikedByCurrentUser = updatedPosts[postIndex!].isLikedByCurrentUser ? false : true;
      updatedPosts[postIndex!].likes = updatedPosts[postIndex!].isLikedByCurrentUser ? updatedPosts[postIndex!].likes +1 :updatedPosts[postIndex!].likes -1;
      setPostsList(updatedPosts);
      dispatch(likePost({postId: postsList![postIndex!].id, isLiked: updatedPosts[postIndex!].isLikedByCurrentUser}));
    }  
  
  return (
    <div className="text-white flex flex-row">

    <span
      onClick={likeCurrentPost} 
      className="cursor-pointer hover:bg-gray-800/40 rounded-full p-1">
    {postsList?.[postIndex!].isLikedByCurrentUser
      ?
      <FavoriteIcon className="text-red-500" />
      :
      <FavoriteBorderOutlinedIcon className="text-red-500" />
    }
   </span>
    <p className="translate-y-[5px]">{postsList?.[postIndex!].likes}</p>
  </div>
  )
}
