import {FC} from "react"
import {useMutation, gql} from "@apollo/client"
import { HeaderButton } from "./StyledUI";

const LOGOUT = gql`
	mutation Logout{
		logout
	}
`;


const LogoutButton:FC<{
  reRender: () => void,
}> = (props) =>{

  const [logout] = useMutation(LOGOUT, {
    onCompleted: (data) =>{
      console.log(data)
      localStorage.removeItem("token");
      props.reRender();
    },
    onError: (error) =>{
      console.log(`app logout error ${error}`)
      // localStorage.removeItem("token");
    },
    context: {
      headers: {
        authorization: localStorage.getItem("token")
      }
    }
    // variables: {props.token}
  });


  return <HeaderButton
    onClick={() =>{
      logout();
    }}//{variables: {ltoken}})}
  >
    Logout
  </HeaderButton>
}

export default LogoutButton;