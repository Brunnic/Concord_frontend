import React from "react";
import { makeStyles } from "@material-ui/styles";
import { List, ListItem } from "@material-ui/core";

const useStyles = makeStyles({
	messages_container: {
		margin: "1rem 0",
		padding: "1rem",
		height: "inherit",
	},
	message_list: {
		height: "94%",
		overflowY: "scroll",
	},
	message: {
		flexDirection: "column",
		display: "flex",
	},
});

const Messages = ({ messages, theFriend, user }) => {
	const classes = useStyles();

	let lastMessage = React.useRef(null);

	React.useEffect(() => {
		if (messages && messages.length > 0) {
			let lastMessageId = messages[messages.length - 1].id;
			lastMessage.current = document.querySelector(
				"#message_id_" + lastMessageId
			);
			lastMessage.current.scrollIntoView({
				behaviour: "smooth",
				block: "nearest",
			});
		}
	}, [messages]);

	return (
		<div className={classes.messages_container}>
			<List
				component='div'
				aria-label='messages'
				className={classes.message_list}
			>
				{messages.map((m) => (
					<ListItem key={m.id} id={`message_id_${m.id}`}>
						<div className={classes.message}>
							<span>
								{m.from_id == theFriend.user.id
									? theFriend.user.userHandle + ": "
									: user.userHandle + ": "}
							</span>
							<span>{m.message}</span>
						</div>
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default Messages;
