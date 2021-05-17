import {
	InMemoryCache,
	ApolloClient,
	split,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

let wsUri = "";
let httpUri = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	// dev code
	wsUri = "ws://localhost:4000/subscriptions";
	httpUri = "http://localhost:4000/graphql";
} else {
	// production code
	wsUri = "wss://concord-brunnic.herokuapp.com/subscriptions";
	httpUri = "https://concord-brunnic.herokuapp.com/graphql";
}

const wsLink = new WebSocketLink({
	uri: wsUri,
	options: {
		reconnect: true,
	},
});

const httpLink = createUploadLink({
	uri: httpUri,
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLink
);

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("token");

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

export const client = new ApolloClient({
	link: authLink.concat(splitLink),
	cache: new InMemoryCache(),
});
