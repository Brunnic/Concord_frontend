import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
	List,
	ListItem,
	ListItemText,
	Input,
	IconButton,
} from "@material-ui/core";
import { gql, useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { connect } from "react-redux";
import SendIcon from "@material-ui/icons/Send";

import Messages from "../../components/messages/Messages.component";

const useStyles = makeStyles({
	container: {
		backgroundColor: "#363636",
		height: "100%",
		padding: "1rem",
		color: "white",
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	friend_container: {
		height: "88%",
	},
	header: {
		boxShadow: "0 1px 2px 0 rgba(0,0,0,0.7)",
		padding: "0.5rem",
	},
	send_container: {
		padding: "1rem",
		backgroundColor: "#404040",
		borderRadius: 15,
		width: "90%",
		display: "flex",
		flexDirection: "row",
		height: "5vh",
	},
	sendForm: {
		flex: 9,
	},
	sendInput: {
		width: "90%",
		color: "white",
	},
	sendIcon: {
		flex: 1,
	},
});

const FriendChat = ({ friend, user, history }) => {
	const classes = useStyles();

	friend = friend.split("/")[1];

	if (user.id == friend) {
		history.replace("/Concord");
	}

	const [getMessage, { data, loading, subscribeToMore }] = useLazyQuery(
		GET_MESSAGES,
		{
			onCompleted: () => {
				subscribeToMore({
					document: NEW_MESSAGE,
					variables: { friend },
					updateQuery: (prev, { subscriptionData }) => {
						if (!subscriptionData.data) return prev;
						const newFeedItem = subscriptionData.data.newMessage;
						return Object.assign({}, prev, {
							getMessages: [...prev.getMessages, newFeedItem],
						});
					},
				});
			},
		}
	);
	const [sendMessage, { data: sentMessage, error: sentMessageError }] =
		useMutation(SEND_MESSAGE, {
			onError: (err) => {
				console.log(err);
			},
			onCompleted: () => {},
		});

	const [message, setMessage] = React.useState("");

	const {
		data: theFriend,
		loading: friendLoading,
		error,
	} = useQuery(GET_FRIEND, {
		variables: { id: friend },
		onCompleted: () => {
			getMessage({
				variables: { friend },
			});
		},
	});

	React.useEffect(() => {
		if (!friendLoading) {
		}
	}, [friendLoading, subscribeToMore]);

	const handleChange = (e) => {
		setMessage(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		sendMessage({
			variables: {
				message,
				to_id: parseInt(theFriend.user.id),
			},
		});

		setMessage("");
	};

	return (
		<div className={classes.container}>
			{theFriend && !friendLoading ? (
				<div className={classes.friend_container}>
					<div className={classes.header}>@ {theFriend.user.userHandle}</div>

					{data && !loading ? (
						<Messages
							messages={data.getMessages}
							theFriend={theFriend}
							user={user}
						/>
					) : (
						<div>No messages</div>
					)}
				</div>
			) : (
				<div>No user found</div>
			)}
			<div className={classes.send_container}>
				<form
					noValidate
					autoComplete='off'
					onSubmit={handleSubmit}
					className={classes.sendForm}
				>
					<Input
						id='message'
						type='message'
						name='message'
						className={classes.sendInput}
						value={message}
						onChange={handleChange}
					/>
				</form>
				<IconButton
					color='primary'
					className={classes.sendIcon}
					onClick={handleSubmit}
				>
					<SendIcon />
				</IconButton>
			</div>
		</div>
	);
};

const GET_FRIEND = gql`
	query getFriend($id: ID!) {
		user(id: $id) {
			id
			email
			username
			userHandle
		}
	}
`;

const GET_MESSAGES = gql`
	query getMessages($friend: ID!) {
		getMessages(friend: $friend) {
			id
			message
			from_id
			to_id
		}
	}
`;

const SEND_MESSAGE = gql`
	mutation sendMessage($message: String!, $to_id: Int!) {
		sendMessage(message: $message, to_id: $to_id) {
			id
			from_id
			to_id
			message
		}
	}
`;

const NEW_MESSAGE = gql`
	subscription newMessage($friend: ID!) {
		newMessage(friend: $friend) {
			id
			from_id
			to_id
			message
		}
	}
`;

const mapStateToProps = (state) => ({
	user: state.user.user,
});

export default connect(mapStateToProps)(FriendChat);
