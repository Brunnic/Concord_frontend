import { GET_FRIEND, CLEAR_FRIEND, FRIEND_ERROR } from "../actions/types";

const initialState = {
	friend: {},
	error: null,
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_FRIEND:
			return {
				...state,
				friend: payload,
			};
		case CLEAR_FRIEND:
			return {
				...state,
				friend: {},
			};
		case FRIEND_ERROR:
			return {
				...state,
				error: "error",
			};
		default:
			return state;
	}
}
