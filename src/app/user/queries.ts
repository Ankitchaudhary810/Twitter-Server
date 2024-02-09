export const queries = `#graphql

    verifyGoogleToken(token:String!):String
    getCurrentUser:User
    getOnlyName: String
    getUserById(id: ID!): User


    DetectLoggedInUser(token:String!):User
    
`