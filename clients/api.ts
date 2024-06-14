import { GraphQLClient } from "graphql-request";

const clientURL = "http://localhost:8000/graphql";
const onServer = typeof window === "undefined";
const tokenLocalStorageKey = "__twitterToken";

// TODO : MAgic link
export const graphQLClient = new GraphQLClient(
    clientURL,
    {
        headers: () => ({
            // if we are on server then dont do this as we dont have localstorage there
            // this is next.js specific stuff as it renders some doc on the server
            Authorization: onServer ? "" : `Bearer ${window.localStorage.getItem(tokenLocalStorageKey)}`
        }),
    }
);