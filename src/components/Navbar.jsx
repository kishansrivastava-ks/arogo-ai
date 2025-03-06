import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthContext from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Nav>
      <NavContainer>
        {/* <Logo>
          Clinic<LogoSpan>360</LogoSpan>
        </Logo> */}
        <Logo />
        <NavLinks>
          <NavItem>
            <StyledLink to="/">Home</StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink to="/search">Find a Doctor</StyledLink>
          </NavItem>

          {user ? (
            <>
              <NavItem>
                <StyledLink to={`/dashboard/${user.role}`}>
                  Dashboard
                </StyledLink>
              </NavItem>
              <NavItem>
                <LogoutButton onClick={logout}>Logout</LogoutButton>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <StyledLink to="/login">Login</StyledLink>
              </NavItem>
              <NavItem>
                <SignUpButton to="/register">Sign Up</SignUpButton>
              </NavItem>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  background: linear-gradient(90deg, #0077b6 0%, #023e8a 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100vw;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

// const Logo = styled.h1`
//   font-size: 1.8rem;
//   font-weight: 700;
//   letter-spacing: -0.5px;
// `;

const LogoSpan = styled.span`
  color: #48cae4;
  font-weight: 800;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #e6f8ff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const SignUpButton = styled(Link)`
  background-color: #48cae4;
  color: #023e8a;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.25rem;
  color: white;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    color: #023e8a;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;
