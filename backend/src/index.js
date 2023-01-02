const {ApolloServer, gql} = require("apollo-server");
const {MongoClient} = require ("mongodb");
const redis  = require ("redis");
const AWS = require('aws-sdk');


const typeDefs = require("./types");
const queryResolver = require("./resolvers/query.js")
const mutationResolver = require("./resolvers/mutation.js")

const resolvers = {
  Query: queryResolver.Query,
  Mutation: mutationResolver.Mutation
}


const redisClient = redis.createClient({
  socket:{
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: true
  },
  password: process.env.REDIS_PASS,
});

// const redisclient2 = new Client()
// redisclient2.open("rdbesspruebapoc2.redis.cache.windows.net:6380,password=Jw0MAxql2HhF5trVmPhGzPA52bBOdOl05AzCaDJyh5U=,ssl=True,abortConnect=False")
// console.log(redisclient2)

console.log(redisClient)

redisClient.on('error', err => {
  console.log('Error redis '+ err)
})

// var s3 = new AWS.S3({
//   accessKeyId: "YiwdRzqjrGKbkUyL", //`${process.env.S3_ACCESS_KEY_ID}`,//"m1YTT0jkovQuulkV",//,//"m1YTT0jkovQuulkV",
//   secretAccessKey: "4eCBiaKAV1c0Yn09Xrf159rQfZViNyyL",//`${process.env.S3_SECRET_ACCESS_KEY}`,//,//"KbN1vw3ZxdXWr8cz7kSWprpwbcyvyN28",
//   endpoint: "http://s3:9000", //`${process.env.S3_URL}`, //process.env.S3_URL, //localhost 9000
//   s3ForcePathStyle: true,
//   signatureVersion: "v4"
// });

// s3.deleteObject


const mongourl = process.env.MONGO_URL;
// console.log(mongourl)
// const mongourl = "mongodb://localhost:27017"

if(!mongourl) console.error("mongo url missing");
else{
  redisClient.connect();
  const client = new MongoClient(mongourl);
  try{
    client.connect().then(() => {
      console.log("mongo db connected");
      const server = new ApolloServer({
        typeDefs, 
        resolvers,
        introspection: true,
        playground: true,
        context: async ({req}) => {
          //el nombre Auth... tiene que estar calcado como llave del header
          const token = req.headers.authorization || ""; 
          
          const db = client.db("test");
          // const user = await db.collection("users").findOne({token}) //si no hay token correcto, token sera null
          // return {db: client.db("test")}
          
          const user = await redisClient.get(token);
          // console.log(user)

          // console.log("hola?")
          // await redisClient.connect();
          // console.log("hola?--")
          // const aaa=await redisClient.CLIENT_INFO()
          // console.log(aaa)
          // await redisClient.set("eee","kkkkkk")
          // const value = await redisClient.get(eee)
          // console.log(value)
          // console.log("hola")

          return{db, user, token, redisClient};
        }
      });
      server.listen().then(({url}) => {
        console.log(`Server is listening at ${url}`);
      })
    });
  }catch(e){
    console.log(e)
  }
}