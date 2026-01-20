import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: { value: [] },
  reducers: {
    fetchPosts: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { fetchPosts } = postSlice.actions;

export default postSlice.reducer;
