import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { gql, useQuery, useMutation } from "@apollo/client";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Concord from "./pages/Concord";

import { checkUser } from "./redux/actions/user";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#2ecc71",
		},
		secondary: {
			main: "#fff",
		},
	},
	overrides: {
		MuiTextField: {
			root: {
				width: "60%",
			},
		},
	},
});

function App({ checkUser }) {
	const { data, loading, error, refetch } = useQuery(GET_USER, {
		onCompleted: () => {},
		onError: (err) => {
			console.log(err);
		},
	});

	const [updateOnlineStatus] = useMutation(UPDATE_USER_STATUS);

	React.useEffect(() => {
		checkUser();
	}, []);

	React.useEffect(() => {
		updateOnlineStatus({ variables: { isOnline: true } });
	}, []);

	const handleDisconnection = (e) => {
		e.preventDefault();
		e.returnValue = "";
		updateOnlineStatus({ variables: { isOnline: false } });
	};

	React.useEffect(() => {
		window.addEventListener("beforeunload", handleDisconnection);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route path='/' exact component={Home} />
					<Route path='/login' exact component={Login} />
					<Route path='/register' exact component={Register} />
					<Route
						path='/Concord'
						render={(props) =>
							data &&
							!loading && (
								<Concord u={data.me} refetchUser={refetch} {...props} />
							)
						}
					/>
				</Switch>
			</Router>
		</ThemeProvider>
	);
}

const GET_USER = gql`
	query me {
		me {
			email
			username
			userHandle
			image_url
		}
	}
`;

const UPDATE_USER_STATUS = gql`
	mutation updateOnlineStatus($isOnline: Boolean!) {
		updateOnlineStatus(isOnline: $isOnline) {
			online
		}
	}
`;

export default connect(null, { checkUser })(App);
