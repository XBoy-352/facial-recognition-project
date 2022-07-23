import styled from "styled-components";
import {Link} from "react-router-dom";

//Navbar Styling
export const NavbarContainer=styled.nav`
    width: 100%;
    height: ${(props)=>(props.extendNavbar ? "50vh":"60px")};
    background-color: black;
    display: flex;
    flex-direction: column;
    @media (min-width: 700px){
        height:60px;
    }
`;
export const LeftContainer = styled.div`
  flex: 70%;
  display: flex;
  align-items: center;
  padding-left: 1%;
`;

export const RightContainer = styled.div`
  flex: 30%;
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
`;

export const NavbarInnerContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
`;

export const NavbarLink = styled(Link)`
  color: #ff477e;
  font-size: x-large;
  font-family: 'Source Sans Pro', sans-serif;
  text-decoration: none;
  margin: 10px;
  &:hover{
    color:white;
    text-decoration: none;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

export const NavbarLinkExtended = styled(Link)`
  color: #ff477e;
  font-size: x-large;
  font-family: 'Nunito Sans', sans-serif;
  text-decoration: none;
  margin: 10px;
  &:hover{
    color:white;
    text-decoration: none;
  }
`;

export const Logo = styled.img`
  margin: 10px;
  max-width: 180px;
  height: auto;
`;

export const OpenLinksButton = styled.button`
  width: 70px;
  height: 180px;
  background: none;
  border: none;
  color: #ff477e;
  font-size: 45px;
  text-decoration: none;
  cursor: pointer;
  @media (min-width: 700px) {
    display: none;
  }
  &:hover{
    color:white;
    text-decoration: none;
  }
`;

export const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: black;
  @media (min-width: 700px) {
    display: none;
  }
`;
export const Dropdown = styled.div`
  color:black;
`