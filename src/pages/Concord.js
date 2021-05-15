import React from "react";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { gql, useMutation } from "@apollo/client";

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

const Concord = ({ location, history, user, loading }) => {
	const classes = useStyles();
	const [onlineIndicator, setOnlineIndicator] = React.useState(0);

	const [updateOnlineStatus] = useMutation(UPDATE_USER_STATUS);

	React.useEffect(() => {
		if (Object.keys(user).length < 1 && !loading) history.replace("/login");
	}, [user]);

	React.useEffect(() => {
		updateOnlineStatus({ variables: { isOnline: true } });
		setOnlineIndicator(
			setInterval(
				() =>
					updateOnlineStatus({
						variables: { isOnline: true },
					}),
				30000
			)
		);

		return () => {
			clearInterval(onlineIndicator);
			updateOnlineStatus({ variables: { isOnline: false } });
		};
	}, []);

	const handleDisconnection = (e) => {
		updateOnlineStatus({ variables: { isOnline: false } });
	};

	React.useEffect(() => {
		window.addEventListener("beforeunload", handleDisconnection);
		window.addEventListener("unload", handleDisconnection);
	}, []);

	return (
		<div className={classes.app}>
			{/* SIDE BAR */}
			{!loading && (
				<div className={classes.friends}>
					<FriendsList history={history} user={user} />
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
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user.user,
	loading: state.user.loading,
});

const UPDATE_USER_STATUS = gql`
	mutation updateOnlineStatus($isOnline: Boolean!) {
		updateOnlineStatus(isOnline: $isOnline) {
			online
		}
	}
`;

export default connect(mapStateToProps)(Concord);
