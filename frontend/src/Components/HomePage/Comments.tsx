import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import {
  fetchComments,
  createComment,
  addCommentToPost,
  deleteComment,
} from "../../Configs/Redux/post";
import { useAppSelector, useAppDispatch } from "../../Configs/Redux/store";
import {
  BlogPostDto,
  CreateCommentDto,
  CommentResponseDto,
} from "../../Configs/Types/Types";
import { styles } from "./CommentsStyles";

interface Props {
  post: BlogPostDto;
}

export default function Comments({ post }: Props) {
  const { user } = useAppSelector((state) => state.account);
  const { status } = useAppSelector((state) => state.post);
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset } = useForm<{ text: string }>();

  const currentPostId = post.id;

  useEffect(() => {
    dispatch(fetchComments(currentPostId));
  }, [dispatch, currentPostId]);

  const submitComment = async (data: { text: string }) => {
    const createCommentDto: CreateCommentDto = {
      text: data.text,
    };
    const result = await dispatch(
      createComment({ postId: currentPostId, createCommentDto })
    );
    if (result.meta.requestStatus === "fulfilled") {
      const newComment: CommentResponseDto = (
        result.payload as { comment: CommentResponseDto }
      ).comment;
      dispatch(
        addCommentToPost({ postId: currentPostId, comment: newComment })
      );
    }
    reset();
  };

  const handleDeleteComment = async (commentId: number) => {
    await dispatch(deleteComment({ postId: post.id, commentId }));
  };

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.subWrapper}>
          {post?.comments?.length === 0 && (
            <span className={styles.noComments}>No comments yet.</span>
          )}
          {post?.comments?.map((comment) => (
            <div key={comment?.id} className="my-2">
              <div className={styles.imgUserTimeWrapper}>
                <img
                  src={`${comment?.authorProfilePic}`}
                  alt="avatar"
                  className={styles.image}
                />
                <p className="text-gray-200">{comment?.authorUsername}</p>
                <p className="text-gray-200">{comment?.createdAt}</p>
              </div>
              <div className={styles.commentsWrapper}>
                <p className="text-gray-300 pt-1">{comment?.text}</p>
                {user?.username === comment.authorUsername && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="px-2 bg-red-500 text-white rounded-md"
                  >
                    {status === "pendingDeleteComment" + comment.id ? (
                      <ClipLoader size={10} color="white" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {user && (
          <form onSubmit={handleSubmit(submitComment)} className={styles.form}>
            <input
              {...register("text", { required: true })}
              type="text"
              placeholder="Add a comment"
              className={styles.commentInput}
            />
            <button type="submit" className={styles.button}>
              {status === "pendingCreateComment" + post.id ? (
                <ClipLoader size={10} color="white" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
