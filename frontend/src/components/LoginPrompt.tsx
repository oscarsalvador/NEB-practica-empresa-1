import React, {FC, useEffect, useState} from "react"
import {useMutation, gql} from "@apollo/client"
import Modal from "react-modal";
import styled from "@emotion/styled";

import {CloseButton} from "./StyledUI"

const ModalTabButton = styled.button<{loginmode: boolean}>`
  padding: 15px;
  opacity: ${(props) => props.loginmode === true? "1":"0.2"};
  background-color: white;
  border: 0px white;
  cursor: pointer;
`;

const LOGIN = gql`
	mutation Login($user: String!, $password: String!){
		login(userName: $user, password: $password)
	}
`;

const REGISTER = gql`
	mutation Register($user: String!, $password: String!){
		register(userName: $user, password: $password){
			userName
		}
	}
`;

const LoginPrompt:FC<{
	reRender: () => void,
	mModal: string,
	setmModal: (mModal: string) => void,
}> = (props) => {
	const [user, setUser] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [login] = useMutation(LOGIN, {
			onCompleted: (data) =>{
				console.log(`loginPrompt saving cookie with token: ${data.login}`)
				localStorage.setItem("token", data.login);
				props.setmModal("");
				console.log(`loginPrompt user ${user}`)
			},
			onError: (error) =>{
				console.log(`loginPrompt error ${error}`);
				localStorage.removeItem("token");
				setIncorrect(true)
			}
	 	}
	);

	const [register] = useMutation(REGISTER, {
		onCompleted: (data) =>{
			console.log(`loginPrompt REGISTER completed ${data}`);
			console.log(`loginPrompt REGISTER ${data.register.userName}`);
			login({variables: {user, password}});
		},
		onError: (error) =>{
			console.log(`loginPrompt REGISTER error${error}`);
			setIncorrect(true);
		}
	});


	
	const [incorrect, setIncorrect] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>("login");
	const [confirmPw, setconfirmPw] = useState<string>("");
  const [pwValid, setValid] = useState<boolean>(false);
	
	const validatePw = () => {
		// let validPattern = /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{4}[ ]*$/g.test(confirmPw);
		let validPattern = /(?=.*[A-Z])(?=.*[!@#$&*"])(?=.*[0-9])(?=.*[a-z]).{4,}[ ]*$/g.test(confirmPw);
    console.log(`loginPrompt validatepw ${confirmPw}`)
    console.log(`loginPrompt validatepw ${pwValid}`)
    setValid(validPattern && confirmPw === password);
  }
	
	useEffect(() =>{
    validatePw();
  }, 
    [confirmPw, password]
  )

	return (
		<Modal
			isOpen={props.mModal==="login"}
      appElement={document.getElementById('root') as HTMLElement}
		>
			<CloseButton 
				onClick={()=>props.setmModal("")}
				style={{float: "right"}}
			>
				X
			</CloseButton>
			
			{/* Titles */}
			<ModalTabButton 
        loginmode={modalMode === "login"}
        onClick={()=> setModalMode("login")}
      >
        <h1>Login</h1>
      </ModalTabButton>
      <ModalTabButton
        loginmode={modalMode === "register"}
        onClick={()=> setModalMode("register")}
      >
        <h1>Register</h1>
			</ModalTabButton>

			{/* Form */}
			<div style={{color: "red"}}>{incorrect? "User or password is incorrect" : ""}</div>

			<input 
				value={user}
				onChange={(e) => setUser(e.target.value)}
				type="text" 
				placeholder="user"
			></input>
			
			<br/>

			<input 
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				type="text" 
				placeholder="password"
			></input>
			
			<br/>

			{/* Changes between login or register */}
			{modalMode === "login" ?
				<div><button onClick={() =>{
					login({variables: {user, password}})
					setIncorrect(false)
				}}>
					Login
				</button></div>
			:
				<div>
					<input 
						value={confirmPw}
						onChange={(e) => setconfirmPw(e.target.value)}
						type="text" 
						placeholder="retype password"
					></input>
				
					<br/>

					<div style={{color: "red"}}>{pwValid? 
						<button onClick={() =>{
							register({variables: {user, password}})
							setIncorrect(false)
						}}>
							Register
						</button>
					: 
						<div>
							Password invalid, must have:<br/>
							lower and upper case letters,<br/>
							numbers and special special characters (!@#$*")<br/>
							And both passwords must match
						</div>
					}</div>

				</div>
			}

		</Modal>
	)
}

export default LoginPrompt;