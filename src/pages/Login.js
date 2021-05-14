import React from "react";
import { Container, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { login } from "../redux/actions/user";

const useStyles = makeStyles({
	container: {
		backgroundColor: "#292929",
		color: "white",
		height: "100vh",
	},
	title: {
		paddingTop: "3rem",
		textAlign: "center",
		color: "#2ecc71",
	},
	form: {
		display: "flex",
		width: "50%",
		flex: 1,
		flexDirection: "column",
		margin: "2rem auto",
		justifyContent: "center",
		alignItems: "center",
	},
	textFields: {
		color: "white",
		flex: 1,
		marginTop: "2rem",
	},
	button: {
		marginTop: "2rem",
	},
	create: {
		textAlign: "center",
	},
	link: {
		color: "#2ecc71",
		textDecoration: "none",
	},
});

const Login = ({ login, history }) => {
	const [formData, setFormData] = React.useState({
		email: "",
		password: "",
	});

	const [error, setError] = React.useState(false);

	const [loginUser, { data }] = useLazyQuery(LOGIN_USER, {
		onError: (err) => {
			if (err.message === "Invalid Credentials") {
				setError(true);
			}
		},
		onCompleted: () => {
			login(data.loginUser);
			history.replace("/");
		},
	});

	const classes = useStyles();

	const handleChanges = (e) => {
		if (error) {
			setError(false);
		}
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const { email, password } = formData;

	return (
		<div>
			<Container className={classes.container}>
				<div className={classes.title}>
					<h1>Login</h1>
				</div>

				<div className={classes.form}>
					<TextField
						id='email'
						placeholder='email'
						name='email'
						type='email'
						color='secondary'
						onChange={handleChanges}
						value={email}
						inputProps={{
							className: classes.textFields,
						}}
						error={error}
					/>
					<TextField
						id='password'
						placeholder='password'
						name='password'
						type='password'
						color='secondary'
						size='medium'
						onChange={handleChanges}
						value={password}
						inputProps={{
							className: classes.textFields,
						}}
						error={error}
					/>
					<Button
						className={classes.button}
						variant='contained'
						color='primary'
						onClick={() => {
							console.log(email, password);
							loginUser({
								variables: {
									email,
									password,
								},
							});
						}}
					>
						Log In
					</Button>
				</div>

				<div>
					<p className={classes.create}>
						Don't have an account{" ? "}
						<Link className={classes.link} to='/register'>
							Make one now!
						</Link>
					</p>
				</div>
			</Container>
		</div>
	);
};

const LOGIN_USER = gql`
	query loginUser($email: String!, $password: String!) {
		loginUser(email: $email, password: $password) {
			token
			email
			username
			userHandle
		}
	}
`;

export default connect(null, { login })(Login);
