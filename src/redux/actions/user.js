import { CHECK_USER, LOGIN_USER, LOGOUT_USER, NO_USER } from "./types";
import jwt from "jwt-decode";

export const checkUser = () => (dispatch) => {
	const token = localStorage.getItem("token");
	if (token) {
		const user = jwt(token);
		dispatch({
			type: CHECK_USER,
			payload: { ...user, token },
		});
	} else {
		dispatch({
			type: NO_USER,
		});
	}
};

export const login = (userInfo) => (dispatch) => {
	const { token } = userInfo;
	localStorage.setItem("token", token);

	dispatch({
		type: LOGIN_USER,
		payload: userInfo,
	});
};

export const logout = () => (dispatch) => {
	localStorage.setItem("token", "");

	dispatch({
		type: LOGOUT_USER,
	});
};
