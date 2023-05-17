import React from "react";

function Home() {
	const link = "https://henok.us";
	const target = "_blank";

	return (
		<div className="container">
			<h1>MERN Stack CRUD</h1>
			<h2>{ process.env.REACT_APP_CLIENT_NAME } Application </h2>
		        <h3>{ process.env.REACT_APP_SUBSCRIPTION } Version </h3>
		</div>
	);
}

export default Home;
