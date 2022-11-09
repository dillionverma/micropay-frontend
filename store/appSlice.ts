import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define a type for the slice state
interface AppState {
  quantity: number;
}

// Define the initial state using that type
const initialState: AppState = {
  quantity: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
  },
});

export const selectQuantity = (state: RootState) => state.app.quantity;

export const { setQuantity } = appSlice.actions;
export default appSlice.reducer;
