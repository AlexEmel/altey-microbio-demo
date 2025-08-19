import { createSlice } from "@reduxjs/toolkit";

interface IAppState {
  isLoading: boolean;
}

const initialState: IAppState = {
  isLoading: false,
};

export const microbioSlice = createSlice({
  name: "microbio",
  initialState,
  reducers: {
    reset: () => initialState,
  },
});

export const { reset } = microbioSlice.actions;
