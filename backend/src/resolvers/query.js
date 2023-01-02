const { ApolloError } = require("apollo-server");

const queryresolver = {
  Query: {
    test: () =>{
      return "funciona";
    },

    getPosts: async (parent, args, ctx) =>{
      try{
        const {db, user} = ctx;
        // if(!user) throw new ApolloError("Unauthorized", "401")

        // console.log("db.listCollections()");
        // console.log(db);
        const postlist = await db.collection("posts").find({}).toArray();
        // postlist = postlist.toArray();
        // console.log(postlist)
        postlist.forEach(e => {
          // console.log(e)
          e.canEdit = e.name === user
        });
        return postlist;
      }catch(e){
        throw new ApolloError(e, e.extensions.code)
      }
    },

    getUploadUrl: async (parent, args, ctx) => {
      const {user, s3} = ctx;
      if(!user) throw new ApolloError("Unauthorized", "401")
      
      const url = s3.getSignedUrl('putObject', {
        Bucket: "statics",
        Key: Date.now() + ".png",//"fileName.png",
        Expires: 60 * 60,
        ContentType: 'image/*'
      })

      console.log(url)

      return url
    }

  }
};

module.exports = queryresolver

