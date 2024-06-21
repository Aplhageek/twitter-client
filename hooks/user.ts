import { graphQLClient } from "@/clients/api"
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/queries/user"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";

/**
 * -  inorder for this to work wrap the app component inside querrycliendProvider
 * - A custom hook that fetches the current user's details using a GraphQL query.
 * - It leverages React Query's `useQuery` hook to manage fetching, caching, and updating the state of the user data.
 *
 * @returns An object containing the query result and the fetched user data.
 */
export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"], // Unique identifier for the query
    queryFn: () => graphQLClient.request(getCurrentUserQuery), // Fetches data using the GraphQL client
  });

  return {
    ...query, // Spreads the properties of the query object
    user: query.data?.getCurrentUser, // Extracts the user data, if available
  };
};


/**
 * whenever we get new id, we fetch the latest data
 * 
 * @param id id of the user
 * @returns user data
 * 
 */
export const useGetUserById = (id: string) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["user-by-id"],
    queryFn: () => graphQLClient.request(getUserByIdQuery, { id }),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["user-by-id"] });
  }, [id]);

  return {
    ...query,
    user: query.data?.getUserById,
  }
}