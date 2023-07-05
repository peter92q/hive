import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { CreatePostDto, BlogPostDto, CreateCommentDto, CommentResponseDto } from '../Types/Types';


interface PostState {
  post: CreatePostDto | null;
  status: string;
  posts: BlogPostDto[];
  skip: number;
  take: number;
  isNewPost: boolean;
}

const initialState: PostState = {
  post: null,
  status: 'idle',
  posts: [],
  skip: 0,
  take: 2,
  isNewPost: false,
};

export const createPost = createAsyncThunk(
  'createPost/createPostAsync',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<BlogPostDto>('/blogposts', formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  } 
); 

export const deletePost = createAsyncThunk(
  'posts/deletePostAsync',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`BlogPosts/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createComment = createAsyncThunk(
  'posts/createCommentAsync',
  async (
    {
      postId,
      createCommentDto,
    }: { postId: number; createCommentDto: CreateCommentDto },
    { rejectWithValue } 
  ) => {
    try {
      const response = await axios.post<CommentResponseDto>(
        `/blogposts/${postId}/createComment`,
        createCommentDto
      );
      return { postId, comment: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteCommentAsync',
  async (
    { postId, commentId }: { postId: number; commentId: number },
    { rejectWithValue }
  ) => {
    try {
      await axios.delete(`blogposts/${postId}/comments/${commentId}`);
      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'posts/fetchCommentsAsync',
  async (postId: number) => {
    const response = await axios.get<CommentResponseDto[]>(
      `/blogposts/${postId}/comments`
    );
    return { postId, comments: response.data };
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLikePost',
  async ({ id, isLiked }: { id: number; isLiked: boolean }, { dispatch }) => {
    try {
      await axios.post(`/BlogPosts/${id}/like`);
      dispatch(likePost({ postId: id, isLiked: !isLiked }));
    } catch (error) {
      console.log(error);
    }
  }
);

export const loadMorePosts = createAsyncThunk(
  'posts/loadMorePosts',
  async ({ skip, take }: { skip: number; take: number }) => {
    const response = await axios.get<BlogPostDto[]>(
      `/blogposts/experimental?skip=${skip}&take=${take}`
    );
    return response.data;
  }
);

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addNewPost: (state, action: PayloadAction<BlogPostDto>) => {
      const newPost = action.payload;
      state.posts = [newPost, ...state.posts];
      state.isNewPost = true;
    },
    likePost(
      state,
      action: PayloadAction<{ postId: number; isLiked: boolean }>
    ) {
      const { postId, isLiked } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.likes += isLiked ? 1 : -1;
        post.isLikedByCurrentUser = isLiked;
      }
    },
    deleteCurrentComment(
      state,
      action: PayloadAction<{ postId: number; commentId: number }>
      )
      {
        const { postId, commentId } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.comments = post.comments.filter(
            (comment) => comment.id !== commentId
            );
            post.commentsCount = post.commentsCount-1;
          }
        
    },
    deleteCurrentPost(
      state,
      action: PayloadAction<{postId: number}>
    )
    {
      const {postId} = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    addCommentToPost(
      state,
      action: PayloadAction<{ postId: number; comment: CommentResponseDto }>
    ) {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.comments.push(comment);
        post.commentsCount += 1;
      }
    },
    setIsNewPost(state, action: PayloadAction<{ isNewPost: boolean }>) {
      state.isNewPost = action.payload.isNewPost;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state, _action) => {
        state.status = 'pendingCreate';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        const newPost = { ...action.payload, comments: [] };
        state.posts.unshift(newPost);
        state.status = 'idle';
      })
      .addCase(toggleLikePost.pending, (state, action) => {
        state.status = 'pendingLike' + action.meta.arg.id;
      })
      .addCase(toggleLikePost.fulfilled, (state, _action) => {
        state.status = 'idle';
      })
      .addCase(toggleLikePost.rejected, (state, _action) => {
        state.status = 'idle';
      })
      .addCase(deletePost.pending, (state, action) => {
        state.status = 'pendingDeletePost' + action.meta.arg;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.status = 'idle';
      })
      .addCase(loadMorePosts.fulfilled, (state, action) => {
        state.status = 'idle';
        const newPosts = action.payload.map((post) => ({
          ...post,
          comments: [],
        }));
        const uniqueNewPosts = newPosts.filter(
          (post) => !state.posts.some((p) => p.id === post.id)
        );
        state.posts.push(...uniqueNewPosts);
        state.skip += state.take;
      })
      .addCase(loadMorePosts.rejected, (state, action) => {
        state.status = action.error.message || 'An error occurred.';
      })
      .addCase(createComment.pending, (state, action) => {
        state.status = 'pendingCreateComment' + action.meta.arg.postId;
      })
      .addCase(createComment.fulfilled, (state, _action) => {
        state.status = 'idle';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) => {
          if (post.id === action.payload.postId) {
            return { ...post, comments: action.payload.comments };
          }
          return post;
        });
      })
      .addCase(deleteComment.pending, (state, action) => {
        state.status = 'pendingDeleteComment' + action.meta.arg.commentId;
      })
      .addCase(
        deleteComment.fulfilled,
        (
          state,
          action: PayloadAction<{ postId: number; commentId: number }>
          ) => {
            const { postId, commentId } = action.payload;
            const post = state.posts.find((post) => post.id === postId);
            if (post) {
              post.comments = post.comments.filter(
                (comment) => comment.id !== commentId
                );
                post.commentsCount = post.comments.length;
              }
            }
            );
  },
}); 

export const {
  likePost,
  addCommentToPost,
  setIsNewPost,
  addNewPost,
  deleteCurrentComment,
  deleteCurrentPost
} = postSlice.actions;
