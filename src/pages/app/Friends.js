import React from "react";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { gql, useQuery } from "@apollo/client";
import { connect } from "react-redux";

import { getFriend } from "../../redux/actions/friend";

const useStyles = makeStyles({
	container: {
		backgroundColor: "#363636",
		height: "100%",
		padding: "1rem",
		color: "white",
	},
	title: {
		fontStyle: "italic",
		padding: "0.5rem",
		backgroundColor: "#404040",
		borderRadius: 15,
		marginBottom: "2rem",
	},
	friendsList: {
		padding: "0.5rem",
		flexDirection: "column",
		rowGap: "0.5rem",
	},
});

const Friends = ({ history, getFriend }) => {
	const { data, loading, error } = useQuery(GET_FRIENDS);

	const classes = useStyles();

	return (
		<div className={classes.container}>
			<h2 className={classes.title}>Your friends list:</h2>

			<div className={classes.friendsList}>
				<List component='div' aria-label='all-friends'>
					{!data ? (
						<ListItem>No friends found sadge.</ListItem>
					) : loading ? (
						<ListItem>Loading...</ListItem>
					) : data.getFriends.length < 1 ? (
						<ListItem>No friends found sadge.</ListItem>
					) : (
						data.getFriends.map((f) => (
							<ListItem
								button
								key={f.id}
								onClick={() => {
									history.push("/Concord/friend/" + f.id);
									getFriend(f);
								}}
							>
								<div>{f.username}</div>
							</ListItem>
						))
					)}
				</List>
			</div>
		</div>
	);
};

const GET_FRIENDS = gql`
	query {
		getFriends {
			id
			username
			userHandle
			email
		}
	}
`;

export default connect(null, { getFriend })(Friends);
