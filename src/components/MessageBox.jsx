import React from "react";

export default function MessageBox(props) {
	return (
		//if info show blue msg if error red error msg
		<div className={`alert alert-${props.variant || "info"}`}>
			{props.children}
		</div>
	);
}
