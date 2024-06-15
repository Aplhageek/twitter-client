import { graphQLClient } from "@/clients/api"
import { getCurrentUserQuery } from "@/graphql/queries/user"
import { useQuery } from "@tanstack/react-query"

// inorder for this to work wrap the app component inside querrycliendProvider
export const useCurrentUser = () => {
    const query = useQuery({
      queryKey: ["curent-user"],
      queryFn: () => graphQLClient.request(getCurrentUserQuery),
    });
  
    return { ...query, user: query.data?.getCurrentUser };
  };