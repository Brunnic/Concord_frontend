import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
	Divider,
	Menu,
	MenuItem,
	Icon,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import PersonIcon from "@material-ui/icons/Person";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

const useStyles = makeStyles({
	searchWrapper: {
		padding: "1rem",
		marginTop: "1rem",
		color: "white",
		marginBottom: "2rem",
	},
	searchInput: {
		color: "white",
	},
	text: {
		color: "white",
	},
	searchList: {
		display: "block",
		zIndex: 10,
		width: "8rem",
		position: "absolute",
		top: "4rem",
		left: "1rem",
		backgroundColor: "#121212",
		padding: "0.5rem",
	},
	hideSearchList: {
		display: "none",
	},
	sidebar: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		height: "100%",
		minWidth: "250px",
	},
	userSide: {
		padding: "1rem",
		color: "white",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	userSideHovered: {
		backgroundColor: "#161616",
		cursor: "pointer",
	},
	online: {
		color: "#009432",
	},
	offline: {
		color: "#EA2027",
	},
	avatar: {
		width: "3.5rem",
		height: "3.5rem",
		marginRight: "0.2rem",
		borderRadius: "50%",
	},
});

const FriendsList = ({ friends, history, userId, user: u }) => {
	const [search, setSearch] = React.useState("");
	const searchRef = React.useRef(null);
	const classes = useStyles();

	const { data, loading, subscribeToMore } = useQuery(GET_CONVERSATIONS, {
		onCompleted: () => {
			subscribeToMore({
				document: GET_NEW_CONVO,
				variables: { thisUser: userId },
				updateQuery: (prev, { subscriptionData }) => {
					if (!subscriptionData.data) return prev;
					const newFeedItem = subscriptionData.data.receivedMessage;
					const friendExists = prev.getConversations.filter(
						(f) => f.id == newFeedItem.id
					);
					if (friendExists.length > 0) return prev;
					return Object.assign({}, prev, {
						getConversations: [...prev.getConversations, newFeedItem],
					});
				},
			});
			data.getConversations.forEach((c) => {
				subscribeToMore({
					document: GET_USER_UPDATED_STATUS,
					variables: { theUser: parseInt(c.id) },
					updateQuery: (prev, { subscriptionData }) => {
						if (!subscriptionData) return prev;
						const newFeedItem = subscriptionData.data.onUserUpdateOnlineStatus;
						const friendExists = prev.getConversations.filter(
							(f) => f.id == newFeedItem.id
						);
						if (friendExists.length > 0) return prev;
						return Object.assign({}, prev, {
							getConversations: [...prev.getConversations, newFeedItem],
						});
					},
					onError: (err) => console.log(err),
				});
			});
		},
	});

	React.useEffect(() => {}, [data]);
	const [searchFriend, { data: searchData, loading: searchLoading }] =
		useLazyQuery(SEARCH_FRIEND);

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	React.useEffect(() => {
		if (search !== "") {
			searchFriend({
				variables: {
					userHandle: search,
				},
			});
		}
	}, [search]);

	return (
		<div className={classes.sidebar}>
			<div>
				<div className={classes.searchWrapper}>
					<Input
						className={classes.searchInput}
						id='search-input'
						type='search'
						placeholder='Search...'
						value={search}
						onChange={handleSearch}
						startAdornment={
							<InputAdornment position='start'>
								<SearchIcon />
							</InputAdornment>
						}
					/>

					{searchData && !searchLoading && (
						<List
							component='div'
							className={
								searchData.searchFriend.length < 1 || search == ""
									? classes.hideSearchList
									: classes.searchList
							}
						>
							{searchData.searchFriend.map((f) => (
								<ListItem
									key={f.id}
									button
									onClick={() => history.push("/Concord/friend/" + f.id)}
								>
									<ListItemText>{f.username}</ListItemText>
								</ListItem>
							))}
						</List>
					)}
				</div>

				<div>
					<List component='nav' aria-label='friends'>
						<ListItem
							button
							onClick={() => {
								history.push("/Concord/friends");
							}}
						>
							<ListItemText className={classes.text} primary='Friends' />
						</ListItem>
						<Divider />
						{!data && loading ? (
							<ListItem button>
								<ListItemText
									className={classes.text}
									primary='Search For Friends'
								/>
							</ListItem>
						) : (
							data.getConversations.map((user) => (
								<ListItem
									button
									key={user.id}
									onClick={() => {
										history.push("/Concord/friend/" + user.id);
									}}
								>
									<div>
										{user.image_url ? (
											<img className={classes.avatar} src={user.image_url} />
										) : (
											<PersonIcon className={classes.avatar} />
										)}
									</div>
									<ListItemText
										className={classes.text}
										primary={user.username}
									/>
									<div
										className={user.online ? classes.online : classes.offline}
									>
										{user.online ? "online" : "offline"}
									</div>
								</ListItem>
							))
						)}
					</List>
				</div>
			</div>
			{u && !loading && (
				<div className='userSide' onClick={() => history.push("/Concord/me")}>
					<div>
						{u.image_url ? (
							<img className={classes.avatar} src={u.image_url} />
						) : (
							<PersonIcon className={classes.avatar} />
						)}
					</div>
					<div>@ {u.userHandle}</div>
				</div>
			)}
		</div>
	);
};

const GET_CONVERSATIONS = gql`
	query {
		getConversations {
			id
			email
			username
			userHandle
			online
			image_url
		}
	}
`;

const SEARCH_FRIEND = gql`
	query searchFriend($userHandle: String!) {
		searchFriend(userHandle: $userHandle) {
			id
			username
			userHandle
		}
	}
`;

const GET_NEW_CONVO = gql`
	subscription receivedMessage($thisUser: ID!) {
		receivedMessage(thisUser: $thisUser) {
			id
			email
			username
			userHandle
			online
			image_url
		}
	}
`;

const GET_USER_UPDATED_STATUS = gql`
	subscription onUserUpdateOnlineStatus($theUser: ID!) {
		onUserUpdateOnlineStatus(theUser: $theUser) {
			id
			email
			username
			userHandle
			online
			image_url
		}
	}
`;

export default FriendsList;
