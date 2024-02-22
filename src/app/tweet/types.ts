export const types = `#graphql
    input CreateTweetData {
        content: String!
        imageURL: String
    }
    type Comment{
        id: ID!
        comment: String
        user:[User]
    }
    type Tweet {
        id: ID!
        content: String!
        imageURL: String
        author: User
        likeIds: [String]
        comments: [Comment]
    }
`;
