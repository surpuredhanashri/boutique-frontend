import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { signout } from "./actions/userActions";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PrivateRoute from "./components/PrivateRoute";

function App() {
		//show badge for show number of item
	//get access to cart from redux
	
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;

	const userSignin = useSelector((state) => state.userSignin);
	const { userInfo } = userSignin;
	const dispatch = useDispatch();
	const signoutHandler = () => {
		dispatch(signout());
	};
	return (
		<BrowserRouter>
			<div className="grid-container">
				<header className="row">
					<div>
						<Link className="brand" to="/">
						Boutique
						</Link>
					</div>
					<div>
						<Link to="/cart">
							Cart
							{cartItems.length > 0 && (
								<span className="badge">{cartItems.length}</span>
							)}
						</Link>
						{/* show logged in user */}
						{userInfo ? (
							<div className="dropdown">
								<Link to="#">
									{userInfo.name} <i className="fa fa-caret-down"></i>{" "}
								</Link>
								<ul className="dropdown-content">
									<li>
										<Link to="/profile">User Profile</Link>
									</li>
									<li>
										<Link to="#signout" onClick={signoutHandler}>
											Sign Out
										</Link>
									</li>
								</ul>
							</div>
						) : (
							<Link to="/signin">Sign In</Link>
						)}
					</div>
				</header>
				<main>
					<Route path="/cart/:id?" component={CartScreen}></Route>
					<Route path="/product/:id" component={ProductScreen}></Route>
					<Route path="/signin" component={SigninScreen}></Route>
					<Route path="/register" component={RegisterScreen}></Route>
					<Route path="/shipping" component={ShippingAddressScreen}></Route>
					<Route path="/" component={HomeScreen} exact></Route>
					<Route path="/payment" component={PaymentMethodScreen}></Route>
					<Route path="/placeorder" component={PlaceOrderScreen}></Route>
					<Route path="/order/:id" component={OrderScreen}></Route>
					<PrivateRoute
						path="/profile"
						component={ProfileScreen}
					></PrivateRoute>
				</main>
				<footer className="row center">All right reserved</footer>
			</div>
		</BrowserRouter>
	);
}
export default App;