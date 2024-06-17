import { graphQLClient } from "@/clients/api"
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutation/tweet";
import { getAllTweetsQuery } from "@/graphql/queries/tweets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

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

/**
 * @CreateTweetData is defined at backend and we are using this with the help of codegen
 */
export const useCreateTweet = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphQLClient.request(createTweetMutation, {payload}),
        onMutate: () => toast.loading("Posting Tweet", {id : "1"}), //giving matching id so it wont keep loading forever
        onSuccess: async () => {
           await queryClient.invalidateQueries({queryKey: ["all-tweets"]}), //refetch querries after the success using below query
           toast.success("your tweet has been Posted" , {id: "1"});
        },
    });

    return mutation;
}
