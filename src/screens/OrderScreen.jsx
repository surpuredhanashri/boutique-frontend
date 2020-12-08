import Axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { detailsOrder, payOrder } from "../actions/orderActions";
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import REACT_APP_URL from "../api_call/api"

export default function OrderScreen(props) {
	const orderId = props.match.params.id;
	const [sdkReady, setSdkReady] = useState(false);
	const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  //show the sattus of updated product and paid status in the screen
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    error: errorPay,
    success: successPay,
  } = orderPay;

	const dispatch = useDispatch();
	useEffect(() => {
    
    //imported paypal sdk
    const addPayPalScript = async () => {
      //data comtain clied id
      const { data } = await Axios.get(`${REACT_APP_URL}/api/config/paypal`);
      // create script element and set source of this element is to paypal sdk
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
			script.async = true;
			script.onload = () => {
        //this step happen when script.src downloaded and ready to use
				setSdkReady(true);
      };
      
      //by this line abbove paypal step st as last child of html(in body) element 
			document.body.appendChild(script);
    };
    
    //if order load 
if (!order || successPay || (order && order._id !== orderId)) {
      dispatch({ type: ORDER_PAY_RESET });
      			dispatch(detailsOrder(orderId));
    } 
    //not paid oder
    else {
			if (!order.isPaid) {
        //not loaded
				if (!window.paypal) {
					addPayPalScript();
        } 
        //loaded
        else {
					setSdkReady(true);
				}
			}
		}
	}, [dispatch, order, orderId, sdkReady,successPay]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
	};

	return loading ? (
		<LoadingBox></LoadingBox>
	) : error ? (
		<MessageBox variant="danger">{error}</MessageBox>
	) : (
		<div>
			<h1>Order {order._id}</h1>
			<div className="row top">
				<div className="col-2">
					<ul>
						<li>
							<div className="card card-body">
								<h2>Shipping</h2>
								<p>
									<strong>Name:</strong> {order.shippingAddress.fullName} <br />
									<strong>Address: </strong> {order.shippingAddress.address},
									{order.shippingAddress.city},{" "}
									{order.shippingAddress.postalCode},
									{order.shippingAddress.country}
								</p>
								{order.isDelivered ? (
									<MessageBox variant="success">
										Delivered at {order.deliveredAt}
									</MessageBox>
								) : (
									<MessageBox variant="danger">Not Delivered</MessageBox>
								)}
							</div>
						</li>
						<li>
							<div className="card card-body">
								<h2>Payment</h2>
								<p>
									<strong>Method:</strong> {order.paymentMethod}
								</p>
								{order.isPaid ? (
									<MessageBox variant="success">
										Paid at {order.paidAt}
									</MessageBox>
								) : (
									<MessageBox variant="danger">Not Paid</MessageBox>
								)}
							</div>
						</li>
						<li>
							<div className="card card-body">
								<h2>Order Items</h2>
								<ul>
									{order.orderItems.map((item) => (
										<li key={item.product}>
											<div className="row">
												<div>
													<img
														src={item.image}
														alt={item.name}
														className="small"
													></img>
												</div>
												<div className="min-30">
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</div>
												<div>
													{item.qty} x Rs.{item.price} = Rs.{item.qty * item.price}
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</li>
					</ul>
				</div>
				<div className="col-1">
					<div className="card card-body">
						<ul>
							<li>
								<h2>Order Summary</h2>
							</li>
							<li>
								<div className="row">
									<div>Items</div>
									<div>Rs.{order.itemsPrice.toFixed(2)}</div>
								</div>
							</li>
							<li>
								<div className="row">
									<div>Shipping</div>
									<div>Rs.{order.shippingPrice.toFixed(2)}</div>
								</div>
							</li>
							<li>
								<div className="row">
									<div>Tax</div>
									<div>Rs.{order.taxPrice.toFixed(2)}</div>
								</div>
							</li>
							<li>
								<div className="row">
									<div>
										<strong> Order Total</strong>
									</div>
									<div>
										<strong>Rs.{order.totalPrice.toFixed(2)}</strong>
									</div>
								</div>
							</li>
                {/* loading box to loas paypal and to shiw paypal button */}

              {/* order not paid */}
							{!order.isPaid && (
								<li>
									{!sdkReady ? (
										<LoadingBox></LoadingBox>
									) : (
                    <>
                      {errorPay && (
                        <MessageBox variant="danger">{errorPay}</MessageBox>
                      )}
                      {loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      ></PayPalButton>
                    </>
									)}
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
