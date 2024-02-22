export const muatations = `#graphql
    createTweet(payload: CreateTweetData!): Tweet
    likeTweet(tweetId: String!): Tweet
    unlikeTweet(TweetId: String!): Boolean!
    createComment(TweetId: String!, Comment: String!): Comment
`;
