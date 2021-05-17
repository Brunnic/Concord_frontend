import React from "react";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import FriendsList from "../components/Friends/FriendsList";
import Friends from "./app/Friends";
import FriendChat from "./app/FriendChat";
import User from "./app/User";

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

const MainApp = ({ path, history, refetchUser }) => {
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
		case "me":
			return <User history={history} refetchUser={refetchUser} />;
		default:
			return null;
	}
};

const Concord = ({ location, history, user, loading, u, refetchUser }) => {
	const classes = useStyles();
	const [onlineIndicator, setOnlineIndicator] = React.useState(0);

	React.useEffect(() => {
		if (Object.keys(user).length < 1 && !loading) history.replace("/login");
	}, [user]);

	return (
		<div className={classes.app}>
			{/* SIDE BAR */}
			{!loading && (
				<div className={classes.friends}>
					<FriendsList history={history} userId={user.id} user={u} />
				</div>
			)}

			{/* MAIN APP WINDOW */}
			<div className={classes.main}>
				<MainApp
					path={location.pathname
						.split("/")
						.filter((l, i) => i >= 2)
						.join("/")}
					history={history}
					refetchUser={refetchUser}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user.user,
	loading: state.user.loading,
});

export default connect(mapStateToProps)(Concord);
