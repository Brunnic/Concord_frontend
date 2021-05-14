import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemText,
	Divider,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
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
});

const FriendsList = ({ friends, history }) => {
	const [search, setSearch] = React.useState("");
	const searchRef = React.useRef(null);
	const classes = useStyles();

	const { data, loading } = useQuery(GET_CONVERSATIONS);
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
								<ListItemText
									className={classes.text}
									primary={user.username}
								/>
							</ListItem>
						))
					)}
				</List>
			</div>
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

export default FriendsList;
