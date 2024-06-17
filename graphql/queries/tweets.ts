import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
    query getAllTweets {
        getAllTweets{
            id
            content
            imageURL
            user {
                id
                profileImageURL
                firstName
                lastName
            }
        }
    }    
`);

// always remeber to generate the types using codegen by ==>> yarn codegen 