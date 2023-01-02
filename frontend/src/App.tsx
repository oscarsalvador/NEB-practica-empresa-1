import React, {useState} from 'react';
import './App.css';

import{
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import PostList from './components/PostList';
import LoginPrompt from "./components/LoginPrompt";
// import PostPrompt from "./components/PostPrompt";


import {Header, HeaderButton} from "./components/StyledUI"
import PostPrompt from './components/PostPrompt';
import LogoutButton from './components/Logout';


// var s3 = new AWS.S3({
//   accessKeyId: "YiwdRzqjrGKbkUyL", //`${process.env.S3_ACCESS_KEY_ID}`,//"m1YTT0jkovQuulkV",//,//"m1YTT0jkovQuulkV",
//   secretAccessKey: "4eCBiaKAV1c0Yn09Xrf159rQfZViNyyL",//`${process.env.S3_SECRET_ACCESS_KEY}`,//,//"KbN1vw3ZxdXWr8cz7kSWprpwbcyvyN28",
//   endpoint: "http://statics.local", //`${process.env.S3_URL}`, //process.env.S3_URL, //localhost 9000
//   s3ForcePathStyle: true,
//   signatureVersion: "v4"
// });

// s3.listObjects({ Bucket: "statics" }, (err, data) => {
//   console.log("s3 list objects");
//   console.log(err);
//   console.log(data);
// });



function App() {
  // "for security reasons create-react-app does not allow yo uto define environment variables that do not start with the REACT-APP_ prefix"
  // console.log(process.env.REACT_APP_API_URL)
  // console.log(process.env.REACT_APP_CORS_ORIGIN_TO_ALLOW)

  const client = new ApolloClient({
    uri: process.env.REACT_APP_API_URL,
    cache: new InMemoryCache(),
    connectToDevTools: true
  });


  const [render, setRender] = useState<boolean>(false);
  const token = localStorage.getItem("token"); //ver si existe una cookie con el item token. Cada pagina tiene sus propias cookies
  const [mModal, setmModal] = useState<string>("");

  return (
    <ApolloProvider client={client}>
      <Header>
        {token? 
            <div>
              <LogoutButton 
                reRender={() => setRender(!render)}
              />

              <HeaderButton
                onClick={()=>setmModal("post")}
              >
                Post
              </HeaderButton>
            </div>
          : 
            <HeaderButton
              onClick={()=>setmModal("login")}
            >
              Login
            </HeaderButton>
         }
      </Header>

      <br/><br/><br/>

      <PostList 
        reRender={() => setRender(!render)}
      /> 

      <LoginPrompt 
        reRender={() => setRender(!render)} 
        mModal={mModal} 
        setmModal={setmModal}
      />
      <PostPrompt 
        reRender={() => setRender(!render)} 
        mModal={mModal} 
        setmModal={setmModal}
        // s3={s3}
      />

    </ApolloProvider>
  );
}

export default App;
