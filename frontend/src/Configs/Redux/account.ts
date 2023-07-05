import {
    PayloadAction,
    createAsyncThunk,
    createSlice,
    isAnyOf,
  } from '@reduxjs/toolkit';
import { FieldValues } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '../Types/Types';
import agent from '../axios';
  
  interface AccountState {
    user: User | null; 
    status: string;
    unreadPosts: number | null;
  } 
  
  const initialState: AccountState = {
    user: null,
    status: 'idle',
    unreadPosts: null
  };
  
  export const fetchUnreadPosts = createAsyncThunk('account/unreadPosts',
  async (_, thunkAPI)=>{
    try{
      const convos = await axios.get(
        "http://localhost:5001/api/Message/unreadCount"
      );
      return convos.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({error: error.data})
    }
  })

  export const followUser = createAsyncThunk<{ isFollowing: boolean; followingCount: number},string>('account/followUser', 
  async (userId, thunkAPI) => {
    try {
      const response = await axios.post(`/Account/follow/${userId}`);
      const { followingCount, isFollowing } = response.data;
      thunkAPI.dispatch(updateUserFollowingCount(followingCount));
      return { isFollowing, followingCount }; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  });
  
  export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
      try {
        const response = await axios.post('account/login', data);
        const user = response.data;
        Cookies.set('user', JSON.stringify(user), {
          expires: 7,
          sameSite: 'lax',
          secure: true,
        }); 
        return user;
      } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data });
      }
    }
  );
  
  export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
      thunkAPI.dispatch(setUser(JSON.parse(Cookies.get('user')!)));
      try {
        const user = await agent.requests.get('account/currentUser');
        Cookies.set('user', JSON.stringify(user));
        return user;
      } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data });
      }
    }
  );
  
  export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
      signOut: (state) => {
        state.user = null;
        Cookies.remove('user');
      },
      setUser: (state, action) => {
        state.user = action.payload;
      },
      reduceUnread: (state, action)=> {
        state.unreadPosts! -= action.payload;
      },
      updateUser: (
        state,
        action: PayloadAction<{
          firstName: string;
          lastName: string;
          description: string;
          country: string;
          hashtags: string[];
          facebookUsername: string;
          instagramUsername: string;
          twitterUsername: string;
        }>
      ) => {
        if (state.user) {
          state.user.firstName = action.payload.firstName;
          state.user.lastName = action.payload.lastName;
          state.user.country = action.payload.country;
          state.user.description = action.payload.description;
          state.user.facebookUsername = action.payload.facebookUsername;
          state.user.instagramUsername = action.payload.instagramUsername;
          state.user.twitterUsername = action.payload.twitterUsername;
          state.user.hashtags = action.payload.hashtags;
        }
      },
      updateUserFollowingCount: (state, action) => {
        if (state.user) {
          state.user.followingCount = action.payload;
        }
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCurrentUser.rejected, (state) => {
          state.user = null;
        })
        .addCase(followUser.pending, (state, action) => {
          state.status = `pendingFollow_${action.meta.arg}`;
        })
        .addCase(followUser.fulfilled, (state, _action) => {
          state.status = 'idle';
        })
        .addCase(fetchUnreadPosts.fulfilled, (state, action)=>{
          state.unreadPosts = action.payload;
        })
        .addMatcher(
          isAnyOf(signInUser.pending, fetchCurrentUser.pending),
          (state) => {
            state.status = 'pending';
          }
        )
        .addMatcher(
          isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
          (state, action) => {
            state.status = 'fulfilled';
            state.user = action.payload;
          }
        )
    },
  });
  
  export const { signOut, setUser, updateUser, updateUserFollowingCount, reduceUnread } =
    accountSlice.actions;
  