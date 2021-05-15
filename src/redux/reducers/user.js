import { CHECK_USER, LOGIN_USER, LOGOUT_USER, NO_USER } from "../actions/types";

const initialState = {
	user: {},
	error: null,
	loading: true,
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
				loading: false,
			};
		case LOGOUT_USER:
			return {
				...state,
				user: {},
				loading: false,
			};
		case NO_USER:
			return {
				...state,
				user: {},
				error: "No user found",
				loading: false,
			};
		default:
			return state;
	}
}
