const { ApolloError } = require("apollo-server");
const { ObjectId } = require("mongodb");
const { generateBlobSASQueryParameters, StorageSharedKeyCredential, ContainerSASPermissions, BlobServiceClient, ContainerClient } = require("@azure/storage-blob");

// const AWS = require('aws-sdk');


const mutationResolver = {
  Mutation: {
    addPost: async (parent, args, ctx) => {
      try {
        const {db, user, s3} = ctx;
        console.log("addpost")
        if(!user) throw new ApolloError("Unauthorized", "401")

        const {comment, imgSrc} = args;

        console.log(process.env.STORAGE_ACCOUNT_NAME)
        const AZURE_BLOB = Date.now() + ".png";
        const AZURE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
        const AZURE_CONTAINER = process.env.STORAGE_CONTAINER_NAME;
        const AZURE_PRIMARY_KEY = process.env.STORAGE_ACCOUNT_KEY;

        const key = new StorageSharedKeyCredential(
          accountName= AZURE_ACCOUNT_NAME, 
          accountKey= AZURE_PRIMARY_KEY
        )
          
        console.log(key)
        //This URL will be valid for 1 hour
        const expDate = new Date(new Date().valueOf() + 3600 * 1000);
        
        //Set permissions to read, write, and create to write back to Azure Blob storage
        const containerSAS = generateBlobSASQueryParameters({
          containerName: AZURE_CONTAINER,
          permissions: ContainerSASPermissions.parse("c"),
          expiresOn: expDate
        },sharedKeyCredential=key).toString();
        
        const blobUrl = 'https://'+AZURE_ACCOUNT_NAME+'.blob.core.windows.net/'+AZURE_CONTAINER+'/'+AZURE_BLOB;
        const SaSURL = blobUrl+'?'+containerSAS;
        console.log(`SAS URL for blob is: ${SaSURL}`);
        // return SaSURL;

        const {insertedId} = await db.collection("posts").insertOne({
          name: user, comment, imgSrc: blobUrl
        });


        return {name: user, comment: comment, imgSrc: SaSURL, _id: insertedId};
      }catch(e){
        console.log(e)
        throw new ApolloError(e, e.extensions.code);
      }
    },

    removePost: async (parent, args, ctx) => {
      try {
        const {db, user, token, redisClient} = ctx;
        console.log(`\n\nremovepost user: ${user}`)
        if(!user) throw new ApolloError("Unauthorized", "401")
        const {postid} = args;
        console.log(postid);
        console.log("removePost antes de find");

        let found = null
        try{
          found = await db.collection("posts").findOne({_id: ObjectId(postid)});
          console.log(found)
        }catch(e){
          console.log("Fallo buscando post")
          console.log(e)
          return "Fallo buscando post"
        }
        // const found = await db.collection("posts").findOne({_id: ObjectId(postid)});
        console.log("removePost despues de find");

        // path = found.imgSrc.split("/").pop()
        // console.log(path)
        // s3.deleteObject({
        //   Bucket: "statics",
        //   Key: path
        // },(error,data)=>{
        //   console.log(data)
        //   console.log(error)
        // })
        // s3.deleteObject()

        if (found) {
          console.log("encontrado, antes de redis")

          const username = await redisClient.get(token)
          console.log(username)

          if (found.name === username){
            console.log("post belongs to user")
            try{
              const AZURE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
              const AZURE_CONTAINER = process.env.STORAGE_CONTAINER_NAME;
              const AZURE_PRIMARY_KEY = process.env.STORAGE_ACCOUNT_KEY;
  
              console.log("antes de shared key")
  
              const key = new StorageSharedKeyCredential(accountName= AZURE_ACCOUNT_NAME, accountKey= AZURE_PRIMARY_KEY)
              console.log(key)
  
              const containerClient = new ContainerClient(
                `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER}/`,
                key
              )
  
              console.log("antes de get block blob")
  
              const bloburl = found.imgSrc.split("/")
              const blobName = bloburl[bloburl.length -1]
  
              console.log(blobName)
              const blockBlobClient = await containerClient.getBlockBlobClient(blobName)
              console.log(blockBlobClient.url)
              
              console.log("antes de delete")
  
              const options = {
                deleteSnapshots: 'include'
              }
              const result = await blockBlobClient.deleteIfExists(options)
              // console.log(result)
            }catch(e){
              console.log(e)
            }


          //check if the post, as well as existing, belongs to the user
            const removed = await db.collection("posts").deleteOne({_id: ObjectId(postid)});
            console.log(removed)
          } else {
            throw new ApolloError("Unauthorized, not your post", "401")
          }
          console.log("borrado")
          // return found;
          return "Post removed";
        }else{
          console.log("no existia")
          return "Post not found";
        }


      }catch(e){
        throw new ApolloError(e, e.extensions.code);
      }
    },

    register: async (parent, args, ctx) =>{
      try{
        const db = ctx.db;
        const {userName, password} = args;
        const exists = await db.collection("users").findOne({userName});
        if (exists){
          throw new ApolloError("User already exists", "USER_EXISTS");
        }

        const {insertedId} = await db.collection("users").insertOne({
          userName, password,
        });
  
        return {_id: insertedId, userName}
      } catch(e){
        throw new ApolloError(e, e.extensions.code)
      }
    },

    login: async (parent, args, ctx) =>{
      try{
        const db = ctx.db;
        const {userName, password} = args;
        console.log(userName)
        const userExists = await db.collection("users").findOne({
          userName,
          password
        })
        if(!userExists){
          throw new ApolloError("User or password incorrect", "404")
        }

        console.log("login")
        const token = Math.random().toString(36).substring(2, 15);
        // await db.collection("users").updateOne({userName}, {$set: {token}})
        // console.log(token)

        const redisdb = ctx.redisClient
        await redisdb.set(token, userName)
        await redisdb.expire(token, 3600)
        // const value = await redisdb.get(token)
        // return token;
        // console.log("token: ",token)
        return token;
      }catch(e){
        throw new ApolloError(e, e.extensions.code);
      }
    },

    logout: async (parent, args, ctx) =>  {
      try{
        const {db, user, token} = ctx;
        // const token = args;
        console.log("logout")
        console.log(token)
        // console.log(user)
        // if (!user) throw new ApolloError("Unauthorized", "401");
        // const iduser = user._id;
        // await db.collection("users").updateOne({_id: iduser}, {$set: {token: null}})
        const redisdb = ctx.redisClient
        return await redisdb.del(token)
      }catch(e){
        throw new ApolloError(e, e.extensions.code);
      }
    }
  },
}

module.exports = mutationResolver;