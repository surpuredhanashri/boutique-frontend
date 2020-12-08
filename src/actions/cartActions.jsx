//Add to cart action
import Axios from "axios";
import {
	CART_ADD_ITEM,
	CART_REMOVE_ITEM,
	CART_SAVE_SHIPPING_ADDRESS,
	CART_SAVE_PAYMENT_METHOD,
} from "../constants/cartConstants";

import REACT_APP_URL from "../api_call/api"

// req redux store to add this product to cart
export const addToCart = (productId, qty) => async (dispatch, getState) => {
	const { data } = await Axios.get(`${REACT_APP_URL}/api/products/${productId}`);
	dispatch({
		type: CART_ADD_ITEM,
		payload: {
			name: data.name,
			image: data.image,
			price: data.price,
			countInStock: data.countInStock,
			product: data._id,
			qty,
		},
	});

	//save item in localStorage- after refrashing page in cart prodcut item presnet
	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
	dispatch({ type: CART_REMOVE_ITEM, payload: productId });
	localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
	dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
	localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
	dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
};
