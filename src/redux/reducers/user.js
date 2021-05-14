import { CHECK_USER, LOGIN_USER, LOGOUT_USER, NO_USER } from "../actions/types";

const initialState = {
	user: {},
	error: null,
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case CHECK_USER:
		case LOGIN_USER:
			return {
				...state,
				user: {
					...payload,
				},
			};
		case LOGOUT_USER:
			return {
				...state,
				user: {},
			};
		case NO_USER:
			return {
				...state,
				user: {},
				error: [...state.error, "No user found"],
			};
		default:
			return state;
	}
}
