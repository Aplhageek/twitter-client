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

// export const getSignedURLForTweetsQuery = graphql(`#graphql
//     query GetSignedURL($imageName: String!, $imageType: String!) {
//         getSignedURLForTweetImage(imageName: $imageName, imageType: $imageType)
//     }

// `)

// always remeber to generate the types using codegen by ==>> yarn codegen 