import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart:[],
    addresses:[],
    selectedAddress:null
  },
  reducers: {
    // actions
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCart:(state , action )=>{
      state.cart=action.payload
    },
    addAddress: (state, action) => {
  if (!state.addresses) state.addresses = []
  state.addresses.push(action.payload)
},

setSelectedAddress: (state, action) => {
  state.selectedAddress = action.payload
},

deleteAddress: (state, action) => {
  state.addresses = state.addresses.filter(
    (_, index) => index !== action.payload
  )

  // Reset selectedAddress if it was deleted
  if (state.selectedAddress === action.payload) {
    state.selectedAddress = null
  }
}
  },
});

export const { setProducts ,setCart , addAddress , setSelectedAddress , deleteAddress} = productSlice.actions;
export default productSlice.reducer;


export const fetchCart = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/cart", { withCredentials: true }); // adjust URL
    dispatch(setCart(res.data.cart)); 
  } catch (err) {
    console.error("Failed to fetch cart:", err);
  }
};