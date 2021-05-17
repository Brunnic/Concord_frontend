import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyD_zsFkNx05s57a64bzXhWMqKqqYiabXd0",
	authDomain: "concord-6e42f.firebaseapp.com",
	projectId: "concord-6e42f",
	storageBucket: "concord-6e42f.appspot.com",
	messagingSenderId: "433824916788",
	appId: "1:433824916788:web:c55ba3eb3321b8edce7161",
	measurementId: "G-YS68RGD48K",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
