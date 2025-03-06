import { useContext } from "react";
import styled from "styled-components";
import AuthContext from "../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <Container>
      <h2>Welcome, {user?.name}</h2>
      <h3>Email: {user?.email}</h3>
    </Container>
  );
};

export default PatientDashboard;

const Container = styled.div`
  padding: 2rem;
  width: 75vw;
`;
