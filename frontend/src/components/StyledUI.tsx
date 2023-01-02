import styled from "@emotion/styled";

export const Header = styled.div`
	position: fixed;
  vertical-align: top;
	width: 100%;
	height: 40px;
	background: #555;
  float: top;
`;

export const HeaderButton = styled.button`
  float: right;
  margin: 7px 7px 7px 0px;
  width: 80px;
  cursor: pointer;
`;

export const CloseButton = styled.button`
  // float: right;
  border-radius: 30%;
  background-color: maroon;
  &: hover{
    background-color: red;
    cursor: pointer;
  }
`;

export const RemoveButton = styled.button`
  // float: right;
  border: 0px transparent;
  background-color: transparent;
  color: maroon;
  &: hover{
    color: red;
    font-weight: bold;
    cursor: pointer;
  }
`;

export const Card = styled.div`
  // display: flex;
  // justify-content: space-around;
  padding: 5px 10px 10px 10px;
  border-radius: 2%;
  width: 300px;

  &:hover{
    background-color: lightblue;
  }
`;

export const CardContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
`;

export const CommentBox = styled.div`
  width: 300px;
  height: 50px; 
  overflow: scroll;
  overflow-y: scroll;
`;