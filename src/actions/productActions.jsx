import Axios from "axios";
import {
	//productdetails
	PRODUCT_DETAILS_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	//productlist
	PRODUCT_LIST_FAIL,
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
} from "../constants/productConstants";
import REACT_APP_URL from "../api_call/api"

//productlist
export const listProducts = () => async (dispatch) => {
	dispatch({
		type: PRODUCT_LIST_REQUEST,
	});
	try {
		console.log(`${REACT_APP_URL}/api/products`)
		const { data } = await Axios.get(`${REACT_APP_URL}/api/products`);
		//action to get list of product from backend - to change state of redux based on that we update the homescreen
		dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
	}
};

//productdetails - get id from backend and update redux store based on it
export const detailsProduct = (productId) => async (dispatch) => {
	dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
	try {
		const { data } = await Axios.get(`${REACT_APP_URL}/api/products/${productId}`);
		dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
