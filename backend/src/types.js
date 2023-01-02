const {gql} = require("apollo-server");
// const {GraphQLUpload} = require("graphql-upload")


const typeDefs = gql`
  type Post{
    _id: ID!
    name: String! 
    comment: String
    imgSrc: String
    # theFile: File
    canEdit: Boolean
  }

  type User{
    _id: ID!
    userName: String!
    token: String
  }

  type Query{
    test: String
    getPosts: [Post!]!
    getUploadUrl: String!
  }

  # type UploadedFileResponse {
  #   filename: String!
  #   mimetype: String!
  #   encoding: String!
  #   url: String!
  # }

  type Mutation{
    # singleUpload(file: Upload!): UploadedFileResponse!
    addPost(comment: String, imgSrc: String): Post!
    removePost(postid: String): String!
    register(userName: String, password: String): User!
    login(userName: String, password: String): String!
    logout: Int!
  }
`

module.exports = typeDefs;