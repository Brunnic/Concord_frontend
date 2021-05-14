import {
	InMemoryCache,
	ApolloClient,
	createHttpLink,
	split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
	uri: "wss://concord-brunnic.herokuapp.com/subscriptions",
	options: {
		reconnect: true,
	},
});

const httpLink = createHttpLink({
	uri: "https://concord-brunnic.herokuapp.com/graphql",
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
