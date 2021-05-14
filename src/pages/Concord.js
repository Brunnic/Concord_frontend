import React from "react";
// import {} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import FriendsList from "../components/Friends/FriendsList";
import Friends from "./app/Friends";
import FriendChat from "./app/FriendChat";

const useStyles = makeStyles({
	app: {
		display: "flex",
		flexDirection: "row",
		height: "100vh",
		width: "100%",
		overflow: "hidden",
	},
	friends: {
		flex: 1,
		backgroundColor: "#333333",
		height: "100%",
	},
	main: {
		flex: 5,
	},
});

const MainApp = ({ path, history }) => {
	switch (path) {
		case "friends":
			return <Friends history={history} />;
		case String(path.match(/friend\/\d*/g)):
			return (
				<FriendChat
					friend={String(path.match(/friend\/\d*/g))}
					history={history}
				/>
			);
		default:
			return null;
	}
};

const Concord = ({ location, history }) => {
	const classes = useStyles();
	return (
		<div className={classes.app}>
			{/* SIDE BAR */}
			<div className={classes.friends}>
				<FriendsList history={history} />
			</div>

			{/* MAIN APP WINDOW */}
			<div className={classes.main}>
				<MainApp
					path={location.pathname
						.split("/")
						.filter((l, i) => i >= 2)
						.join("/")}
					history={history}
				/>
			</div>
		</div>
	);
};

export default Concord;
