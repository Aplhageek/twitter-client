import { GraphQLClient } from "graphql-request";

const clientURL = "http://localhost:8000/graphql";
const isClient = typeof window !== "undefined";

const tokenLocalStorageKey = "__twitterToken";

/**
 * authorization: 'Bearer null' <<=== this is how our token will look as getItem can return a null and will be appended as string
 */

// TODO : MAgic link
export const graphQLClient = new GraphQLClient(
    clientURL,
    {
        headers: () => ({
            // if we are on server then dont do this as we dont have localstorage there
            // this is next.js specific stuff as it renders some doc on the server
            Authorization: isClient
                ? `Bearer ${window.localStorage.getItem(tokenLocalStorageKey)}`
                : "",
        }),
    }
);