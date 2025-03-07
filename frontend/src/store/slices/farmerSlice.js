import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  farmer: {
    name: "",
    email: "",
    role: "farmer",
    currentEventStock: [], // Array of products submitted at the market event
    eventId: null,
  },
};

const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    setFarmer: (state, action) => {
      state.farmer = { ...state.farmer, ...action.payload };
    },
    addProductToStock: (state, action) => {
      state.farmer.currentEventStock.push(action.payload);
    },
    removeProductFromStock: (state, action) => {
      state.farmer.currentEventStock = state.farmer.currentEventStock.filter(
        product => product.id !== action.payload
      );
    },
    setEventId: (state, action) => {
      state.farmer.eventId = action.payload;
    },
  },
});

export const { setFarmer, addProductToStock, removeProductFromStock, setEventId } = farmerSlice.actions;
export default farmerSlice.reducer; 