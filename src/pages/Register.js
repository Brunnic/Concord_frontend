import React from "react";
import { Container, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { gql, useMutation } from "@apollo/client";
import { Redirect, Link } from "react-router-dom";

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

const Register = ({ history }) => {
	const [formData, setFormData] = React.useState({
		email: "",
		password: "",
		username: "",
		userHandle: "",
	});

	const [error, setError] = React.useState(false);

	const [newUser, {}] = useMutation(REGISTER_USER, {
		onCompleted: () => {
			console.log("successful");
			history.replace("/login");
		},
		onError: (err) => {
			console.log(err);
			setError(true);
		},
	});

	const classes = useStyles();

	const { email, password, username, userHandle } = formData;

	const handleChanges = (e) => {
		if (error) {
			setError(false);
		}
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div>
			<Container className={classes.container}>
				<div className={classes.title}>
					<h1>Register</h1>
				</div>

				<div className={classes.form}>
					<TextField
						id='username'
						placeholder='username'
						name='username'
						type='username'
						color='secondary'
						onChange={handleChanges}
						value={username}
						inputProps={{
							className: classes.textFields,
						}}
						error={error}
					/>
					<TextField
						id='userHandle'
						placeholder='userHandle'
						name='userHandle'
						type='userHandle'
						color='secondary'
						onChange={handleChanges}
						value={userHandle}
						inputProps={{
							className: classes.textFields,
						}}
						error={error}
					/>
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
							console.log(email, password, username, userHandle);
							newUser({
								variables: {
									email,
									username,
									userHandle,
									password,
								},
							});
						}}
					>
						Register
					</Button>
				</div>

				<div>
					<p className={classes.create}>
						Already have an account{" ? "}
						<Link className={classes.link} to='/login'>
							Log in now!
						</Link>
					</p>
				</div>
			</Container>
		</div>
	);
};

const REGISTER_USER = gql`
	mutation newUser(
		$email: String!
		$username: String!
		$userHandle: String!
		$password: String!
	) {
		newUser(
			data: {
				email: $email
				username: $username
				userHandle: $userHandle
				password: $password
			}
		) {
			id
			email
		}
	}
`;

export default Register;
