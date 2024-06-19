import { graphql } from "../../gql";
// TODO: Add scalar type of date

export const verifyUserGoogleTokenQuery = graphql(`
  #graphql
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageURL
      email
      firstName
      lastName
      tweets{
        id
        content
        imageURL
        user{
          id
          profileImageURL
          firstName
          lastName
        }
      }
    }
  }
`);