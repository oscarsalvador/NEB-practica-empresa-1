import {FC, useState} from "react";
import {useMutation, gql } from "@apollo/client"
import Modal from "react-modal";
// import AWS, { S3 } from "aws-sdk";
import ImageUploading, { ImageListType } from "react-images-uploading";

import {CloseButton} from "./StyledUI"
// import { ImageList } from "aws-sdk/clients/appstream";


// const GET_URL = gql`
//   query GetUploadUrl {
//     getUploadUrl
//   }
// `;

const ADD_POST = gql`
	mutation AddPost(
    $comment: String, 
    $imgSrc: String
  ) {
    addPost(comment: $comment, imgSrc: $imgSrc) {
      _id,
      imgSrc
    }
  }
`;


	

const PostPrompt: FC<{
	reRender: () => void,
	mModal: string,
	setmModal: (mModal: string) => void,
  // s3: AWS.S3
}> = (props) => {

  const [sendPost] = useMutation(ADD_POST, {
		onCompleted: (data) =>{
			console.log(`postprompt mutation complete`)
			// console.log(data)
      return data
		},
		onError: (error) =>{
			console.log(`postprompt mutation ${error}`);
		},
    context: {
      headers: {
        authorization: localStorage.getItem("token")
      }
    }
	});

  const [comment, setComment] = useState<string>("");
  // const [image, setImage] = useState<File>();
  const [imgSrc, setImgSrc] = useState<string>("");
  const [images, setImages] = useState([]);

  // props.s3
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const imgTos3 = async (imageList:ImageListType, comment: string) =>{
    console.log("imgtos3 imgsrc")
    console.log(imgSrc)
    var data = await sendPost({variables: {comment, imgSrc}});
    console.log(data)
    const url = data.data.addPost.imgSrc;
    console.log("imgtos3")
    console.log(url)
    console.log(`cors img2s3 ${process.env.REACT_APP_CORS_ORIGIN_TO_ALLOW}`)
    
    const myHeaders = new Headers({
      'content-type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": `${process.env.REACT_APP_CORS_ORIGIN_TO_ALLOW}`,
      "x-ms-blob-type": "BlockBlob",
      "Vary" : "Origin"
    })
    const req = await fetch(url, {
      method: "PUT",
      body: imageList.at(0)!.file,
      headers: myHeaders 
    }).then((res) => {
      console.log(res)
    }).then((data) => {
      console.log(data)
    }).then((err) => {
      console.log(err)
    })
    console.log(req)
    console.log("out it3")

    props.setmModal("");
    props.reRender();
  }


  // const imgToS3 = (imageList: ImageListType) =>{
  //   console.log(imageList)
  //   const imageName =`${Math.random().toString(36).substring(2, 15)}.png`;
  //   setImgSrc(`http://statics.local`); //`${process.env.S3_URL}/statics/${imageName}`);
  //   try{
  //     const res = props.s3.putObject({
  //       Bucket: "statics",
  //       Key: imageName,
  //       ContentType: "image/jpeg,.png",
        
  //       // Body: images[0]
  //       Body: imageList.at(0)!.file
  //     }).promise()
  //     console.log("postprompt imgtos3 res")
  //     console.log(res)
  //   }catch(e){
  //     console.log(e)
  //   }
  // }


  return (
    <Modal
      isOpen={props.mModal==="post"}
      appElement={document.getElementById('root') as HTMLElement}
    >
      <CloseButton 
        onClick={()=>props.setmModal("")}
        style={{float: "right"}}
      >
        X
      </CloseButton>
      <h1>Post</h1>
      Image
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={1}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          isDragging,
          dragProps
        }) => (
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? {fontWeight: "bold"} : undefined}
              onClick={
                onImageUpload

              }
              {...dragProps}
            >
              Click or Drop here
            </button>
            <button onClick={onImageRemoveAll}>Remove image</button>

            <br/>
            
            <img 
              key={"image"} 
              src={
                imageList.length > 0?
                  imageList.at(0)!.dataURL
                :
                ""
              } 
              alt="" 
              width="300" 
              height="300"
            />


            <br/>

            Comment
            <br/>
            <input type="text"
              placeholder="required"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)}
              }                
            />

            <button
              style={{
                display: comment.length > 0? "inline" : "none"
              }}
              onClick={()=>{
                // setImgSrc(getUrl.toString)
              
                imgTos3(imageList, comment)
              
              }}
              >
              Send
            </button>
          </div>
        )}
      </ImageUploading>
    </Modal>
  )
}

export default PostPrompt;