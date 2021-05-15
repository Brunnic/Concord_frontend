import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { gql, useQuery } from "@apollo/client";

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
	const { data, loading, error } = useQuery(GET_USER, {
		onCompleted: async () => {},
		onError: (err) => {
			console.log(err);
		},
	});

	React.useEffect(() => {
		checkUser();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<Route path='/' exact component={Home} />
					<Route path='/login' exact component={Login} />
					<Route path='/register' exact component={Register} />
					<Route path='/Concord' component={Concord} />
				</Switch>
			</Router>
		</ThemeProvider>
	);
}

const GET_USER = gql`
	{
		me {
			email
			username
			userHandle
		}
	}
`;

export default connect(null, { checkUser })(App);
