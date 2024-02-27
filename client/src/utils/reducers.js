import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

export const initialState = {
  products: [],
  categories: [],
  currentCategory: '',
  cart: [],
  cartOpen: false
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    productsUpdated: (state, action) => {
      state.products = action.payload;
    },
    addedToCart: (state, action) => {
      state.cartOpen = true;
      state.cart = [...state.cart, action.payload]; // Create a new array
    },
    multipleAddedToCart: (state, action) => {
      state.cart = action.payload.products.slice(); // Create a new array
    },
    cartQuantityUpdated: (state, action) => {
      state.cartOpen = true;
      const { _id, purchaseQuantity } = action.payload;
      const updatedCart = state.cart.map((product) =>
        product._id === _id ? { ...product, purchaseQuantity } : product
      );
      state.cart = updatedCart;
    },
    removedFromCart: (state, action) => {
      state.cartOpen =
        state.cart.filter((product) => product._id !== action.payload._id)
          .length > 0;
      state.cart = state.cart.filter(
        (product) => product._id !== action.payload._id
      );
    },
    cartCleared: (state) => {
      state.cartOpen = false;
      state.cart = [];
    },
    cartToggled: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    categoriesUpdated: (state, action) => {
      state.categories = action.payload;
    },
    currentCategoryUpdated: (state, action) => {
      state.currentCategory = action.payload;
    }
  }
});

export const selectCart = (state) => state.cart;

// Select the products
export const selectProducts = createSelector(
  [selectCart],
  (cart) => cart.products
);

// Select the categories
export const selectCategories = createSelector(
  [selectCart],
  (cart) => cart.categories
);

// Select the current category
export const selectCurrentCategory = createSelector(
  [selectCart],
  (cart) => cart.currentCategory
);

// Select the cart items
export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.cart
);

// Select the cart open status
export const selectCartOpen = createSelector(
  [selectCart],
  (cart) => cart.cartOpen
);

export const {
  productsUpdated,
  addedToCart,
  multipleAddedToCart,
  cartQuantityUpdated,
  removedFromCart,
  cartCleared,
  cartToggled,
  categoriesUpdated,
  currentCategoryUpdated
} = cartSlice.actions;

export default cartSlice.reducer;
