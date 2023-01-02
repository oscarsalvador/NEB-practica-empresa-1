import {FC} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

import {RemoveButton, Card, CardContainer, CommentBox} from "./StyledUI"


type Post = {
  _id: string,
  name: string,
  comment: string,
  imgSrc: string,
  canEdit: string
}


const GET_POSTS = gql`
  query GetPosts{
    getPosts{
      _id
      name
      comment
      imgSrc
      canEdit
    }
  }
`;

const REMOVE_POST = gql`
  mutation RemovePost($postid: String) {
    removePost(postid: $postid)
  }
`;

const PostList:FC<{
  reRender:() => void
  // loginName: string
}> = (props) => {
  const {data, loading, error} = useQuery<{getPosts: Post[]}>(
    GET_POSTS,
    {
      fetchPolicy:"network-only",
      context: {
        headers: {
          authorization: localStorage.getItem("token")
        }
      }
    },
  );
  
  const [removePost] = useMutation(REMOVE_POST, {
    onCompleted: (data) => {
      console.log(`postlist removepost`)
      console.log(data)
      setTimeout(props.reRender, 3000);
    },
    onError: (error) =>{
      console.log(`postlist removepost error`)
      console.log(error)
    },
    context: {
      headers: {
        authorization: localStorage.getItem("token")
      }
    }
  })


  const selectPost = async (selectedPost: string) => {
    console.log(selectedPost)
    await removePost({variables: {postid: selectedPost}})
    props.reRender()
  }

  
  if(loading) return <div>Cargando...</div>
  if(error) {
    console.log(error)
    return <div>Error</div>
  }

  return <CardContainer>
    {data?.getPosts.map(post => (
      <Card key={post._id}>
        <br/>
        <div><b>{post.name}</b></div>
        <br/>
        <img src={post.imgSrc} alt="So... how's the weather?"
          style={{
            width: "300px",
            height: "300px"
        }}/>
        <br/>
        <CommentBox>{post.comment}</CommentBox>
        {post.canEdit ? 
          <RemoveButton 
            onClick={()=>{
              // setRmPostId(post._id)
              selectPost(post._id)
              // removePost({variables: {post._id}})
            }}
          >
            Remove
          </RemoveButton>
        : ""
        }
      </Card>
    ))}
  </CardContainer>;
}

export default PostList;