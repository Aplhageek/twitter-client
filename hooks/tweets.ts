import { graphQLClient } from "@/clients/api"
import { CreateTweetData } from "@/gql/graphql";
import { getAllTweetsQuery } from "@/graphql/queries/tweets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

/**
 * A custom hook that fetches all tweets using a GraphQL query.
 * It utilizes React Query's `useQuery` hook to manage fetching,
 * caching, and updating the state of the tweets data.
 *
 * @returns An object containing the query result and the fetched tweets data.
 * Initializes a query with React Query's `useQuery` hook.
 * - `queryKey`: A unique key for this query, allowing React Query to cache and retrieve the data efficiently.
 * - `queryFn`: A function that returns a promise resolving to the data needed by the component.
 *   Here, it uses the `graphQLClient.request` method to execute the `getAllTweetsQuery`.
 * Returns an object that combines the standard properties of the query object
 * provided by React Query with the specifically requested tweets data.
 * - `query`: Contains various properties about the query status, such as loading state, error, and data.
 * - `tweets`: Directly extracts the array of tweets from the query's data property.
 */
export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ["all-tweets"], // Unique identifier for the query
        queryFn: () => graphQLClient.request(getAllTweetsQuery), // Fetches data using the GraphQL client
    });

    return {
        ...query, // Spreads the properties of the query object
        tweets: query.data?.getAllTweets, // Extracts the tweets data, if available
    };
};


