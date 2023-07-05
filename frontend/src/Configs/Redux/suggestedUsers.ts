import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../Types/Types';

interface SuggestedUsersState {
    users: User[];
  }
  
const initialState: SuggestedUsersState = {
    users: [],
  }; 
  
  export const suggestedUsersSlice = createSlice({
    name: 'suggestedUsers',
    initialState,
    reducers: {
      setSuggestedUsers: (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
      },
      updateSuggestedUser: (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      }
    },
  });

export const { setSuggestedUsers, updateSuggestedUser } = suggestedUsersSlice.actions;
