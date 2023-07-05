import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ClipLoader, PuffLoader } from "react-spinners";
import { toggleLikePost, deletePost } from "../../Configs/Redux/post";
import { useAppDispatch, useAppSelector } from "../../Configs/Redux/store";
import { BlogPostDto } from "../../Configs/Types/Types";
import Comments from "./Comments";
import { styles } from "./PostCardStyles";

interface Posts {
  post: BlogPostDto;
}

export default function PostCard({ post }: Posts) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.account);
  const { status } = useAppSelector((state) => state.post);
  const [showComments, setShowComments] = useState(false);

  const handleLikeClick = (id: number) => {
    if (user) {
      dispatch(toggleLikePost({ id, isLiked: post.isLikedByCurrentUser }));
    } else {
      return;
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await dispatch(deletePost(id));
    } catch (error) { 
      console.log(error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <div className={styles.imgUserNameWrapper}>
          <img
            src={`${post.authorProfilePic ?? "./default.png"}`}
            alt="avatar"
            className={styles.img}
          />
          <Link to={`user/${post.authorId}`} className="translate-y-[-3px]">
            {post.authorUsername}
          </Link>
        </div>
        <p className="text-[12px] pr-2">{post.createdAt}</p>
      </div>
      <img
        src={`${post.image}`}
        alt={`img-${post.id}`}
        className={styles.postImage}
      />
      <div>
        <div className={styles.likeAndCommentWrapper}>
          <div className={styles.subWrapper}>
            <div className={styles.subWrapper2}>
              <IconButton onClick={() => handleLikeClick(post.id)}>
                {post.isLikedByCurrentUser ? (
                  <>
                    {status === "pendingLike" + post.id ? (
                      <PuffLoader size={24} color="gray" />
                    ) : (
                      <FavoriteIcon className="text-red-500" />
                    )}
                  </>
                ) : (
                  <>
                    {status === "pendingLike" + post.id ? (
                      <PuffLoader size={24} color="gray" />
                    ) : (
                      <FavoriteBorderOutlinedIcon className="text-red-500" />
                    )}
                  </>
                )}
              </IconButton>
              <div className={styles.likesText}>
                {post.likes} Likes
              </div>
            </div>
            <div className={styles.commentsIconWrapper}>
              <p className="text-white">{post.commentsCount} comments</p>
              <ChatBubbleOutlineIcon
                onClick={() => setShowComments((prev) => !prev)}
                className={styles.commentIcon}
              />
            </div>
          </div>
          <div
            className={styles.deleteIconWrapper}
            onClick={() => handleDeleteClick(post.id)}
          >
            {user?.email === post.postEmail ? (
              <>
                {status === "pendingDeletePost" + post.id ? (
                  <ClipLoader
                    size={15}
                    color="white"
                    className="mr-[2px] mb-[3px]"
                  />
                ) : (
                  <DeleteOutlineOutlinedIcon className="text-white" />
                )}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={styles.descriptionWrapper}>
          <div className={styles.descSubWrapper}>
            <p className={styles.description}>{post.description}</p>
          </div>
        </div>
        {showComments && <Comments post={post} />} 
      </div> 
    </div>
  );
}
