import React from "react";
import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { connect } from "react-redux";

import { logout } from "../redux/actions/user";

const useStyles = makeStyles({
	navbarItems: {
		justifyContent: "space-between",
	},
	navbar: {
		backgroundColor: "#121212",
		color: "white",
	},
	navLinks: {
		color: "white",
	},
	container: {
		backgroundColor: "#292929",
		color: "white",
		height: "91.5vh",
	},
	title: {
		color: "#2ecc71",
		marginBottom: "3rem",
	},
	head: {
		textAlign: "center",
		paddingTop: "6rem",
		color: "white",
	},
	headButton: {
		marginTop: "3rem",
	},
});

const Home = ({ history, user, logout }) => {
	const classes = useStyles();
	return (
		<div>
			<AppBar position='static' className={classes.navbar}>
				<Toolbar className={classes.navbarItems}>
					<Typography variant='h6' color='primary'>
						Concord
					</Typography>
					<div>
						{Object.keys(user).length < 1 && user ? (
							<React.Fragment>
								<Button color='inherit' onClick={() => history.push("/login")}>
									Login
								</Button>
								<Button
									color='inherit'
									onClick={() => history.push("/register")}
								>
									Register
								</Button>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Button
									color='inherit'
									onClick={() => history.push("/Concord")}
								>
									Open Concord
								</Button>
								<Button color='inherit' onClick={() => logout()}>
									Logout
								</Button>
							</React.Fragment>
						)}
					</div>
				</Toolbar>
			</AppBar>

			<Container className={classes.container}>
				<div className={classes.head}>
					<h1 className={classes.title}>Welcome to Concord!</h1>
					<p>
						Do you chat with your friends all the time ? Then try out Concord!
						with some amazing features you will love using it all day.
						<br />
						So, what are you waiting for ? Try it now!
					</p>
					<Button
						className={classes.headButton}
						variant='contained'
						color='primary'
						onClick={() => {
							history.push("/login");
						}}
					>
						Make an account
					</Button>
				</div>
			</Container>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user.user,
});

export default connect(mapStateToProps, { logout })(Home);
