import { GET_FRIEND, CLEAR_FRIEND, FRIEND_ERROR } from "./types";

export const getFriend = (friend) => (dispatch) => {
	dispatch({
		type: GET_FRIEND,
		payload: friend,
	});
};

export const clearFriends = () => (dispatch) => {
	dispatch({
		type: CLEAR_FRIEND,
	});
};
