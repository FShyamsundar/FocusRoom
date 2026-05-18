import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api } from "../../lib/axios";

export const fetchCommunityPosts = createAsyncThunk(
  "community/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/community/posts");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load community posts");
    }
  }
);

export const createCommunityPost = createAsyncThunk(
  "community/createPost",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/community/posts", payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to create post");
    }
  }
);

export const updateCommunityPost = createAsyncThunk(
  "community/updatePost",
  async ({ postId, payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/community/posts/${postId}`, payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to update post");
    }
  }
);

export const deleteCommunityPost = createAsyncThunk(
  "community/deletePost",
  async (postId, thunkAPI) => {
    try {
      await api.delete(`/community/posts/${postId}`);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to delete post");
    }
  }
);

export const toggleCommunityPostLike = createAsyncThunk(
  "community/toggleLike",
  async (postId, thunkAPI) => {
    try {
      const { data } = await api.post(`/community/posts/${postId}/like`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to update like");
    }
  }
);

export const addCommunityComment = createAsyncThunk(
  "community/addComment",
  async ({ postId, content }, thunkAPI) => {
    try {
      const { data } = await api.post(`/community/posts/${postId}/comments`, { content });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to add comment");
    }
  }
);

export const deleteCommunityComment = createAsyncThunk(
  "community/deleteComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      const { data } = await api.delete(`/community/posts/${postId}/comments/${commentId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to delete comment");
    }
  }
);

const replacePost = (posts, nextPost) =>
  posts.map((post) => (post._id === nextPost._id ? nextPost : post));

const communitySlice = createSlice({
  name: "community",
  initialState: {
    posts: [],
    loading: false,
    error: null,
    composer: {
      caption: "",
      taskName: "",
      focusDuration: "",
    },
  },
  reducers: {
    setComposerField: (state, action) => {
      state.composer[action.payload.field] = action.payload.value;
    },
    hydrateComposerFromCompletion: (state, action) => {
      state.composer.taskName = action.payload.taskName || "";
      state.composer.focusDuration = action.payload.focusDuration || "";
      state.composer.caption = `Wrapped up "${action.payload.taskName}" and closed a focused ${action.payload.focusDuration}-minute block.`;
    },
    clearComposer: (state) => {
      state.composer = { caption: "", taskName: "", focusDuration: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCommunityPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.composer = { caption: "", taskName: "", focusDuration: "" };
      })
      .addCase(updateCommunityPost.fulfilled, (state, action) => {
        state.posts = replacePost(state.posts, action.payload);
      })
      .addCase(deleteCommunityPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(toggleCommunityPostLike.fulfilled, (state, action) => {
        state.posts = replacePost(state.posts, action.payload);
      })
      .addCase(addCommunityComment.fulfilled, (state, action) => {
        state.posts = replacePost(state.posts, action.payload);
      })
      .addCase(deleteCommunityComment.fulfilled, (state, action) => {
        state.posts = replacePost(state.posts, action.payload);
      });
  },
});

export const { clearComposer, hydrateComposerFromCompletion, setComposerField } = communitySlice.actions;
export default communitySlice.reducer;
