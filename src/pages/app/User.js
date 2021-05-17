import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
	FormControl,
	Input,
	InputLabel,
	FormGroup,
	Button,
} from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { connect } from "react-redux";

import { storage } from "../../utils/firebase";

const useStyles = makeStyles({
	container: {
		padding: "1rem",
	},
	inputs: {
		color: "white",
	},
});

const User = ({ user, refetchUser }) => {
	const classes = useStyles();
	const [formData, setFormData] = React.useState({
		email: "",
		username: "",
	});
	const [image, setImage] = React.useState(null);

	const [updateUser, { data }] = useMutation(UPDATE_USER_INFO, {
		onError: (err) => {
			console.log(err);
		},
		onCompleted: () => {
			refetchUser();
		},
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImage = (e) => {
		// console.log(e.target.files[0]);
		setImage(e.target.files[0]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (image !== null) {
			const pathName = `avatars/${Date.now()}-${user.username}-${image.name}`;
			const uploadTask = storage.ref(pathName).put(image);

			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref(pathName)
						.getDownloadURL()
						.then((url) => {
							updateUser({
								variables: {
									image: url,
									...formData,
								},
							});
						});
				}
			);

			setFormData({ email: "", username: "" });
		} else {
			updateUser({
				variables: {
					...formData,
				},
			});
		}
	};

	return (
		<div className={classes.container}>
			<form>
				<FormGroup>
					<FormControl>
						<InputLabel htmlFor='email-update' color='secondary'>
							Change Email
						</InputLabel>
						<Input
							className={classes.inputs}
							id='email-update'
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
						/>
					</FormControl>
					<FormControl>
						<InputLabel htmlFor='username-update' color='secondary'>
							Change Username
						</InputLabel>
						<Input
							className={classes.inputs}
							id='username-update'
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChange}
						/>
					</FormControl>
					<FormControl>
						<InputLabel htmlFor='avatar-update' color='secondary'>
							Change avatar
						</InputLabel>
						<Input
							className={classes.inputs}
							id='avatar-update'
							type='file'
							name='image'
							onChange={handleImage}
						/>
					</FormControl>
					<Button variant='contained' color='primary' onClick={handleSubmit}>
						Save changes
					</Button>
				</FormGroup>
			</form>
		</div>
	);
};

const UPDATE_USER_INFO = gql`
	mutation updateUser($email: String, $username: String, $image: String) {
		updateUser(email: $email, username: $username, image: $image) {
			username
		}
	}
`;

const mapStateToProps = (state) => ({
	user: state.user.user,
});

export default connect(mapStateToProps)(User);
