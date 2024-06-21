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

export const getSignedURLForTweetQuery = graphql(`
    query GetSignedURL($imageName: String!, $imageType: String!) {
      getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
    }
`);