import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import PatientSidebar from "../components/PatientSidebar";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
  position: relative;
`;

const MainContent = styled(motion.div)`
  flex-grow: 1;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow-y: auto;
  margin: 1.5rem;
  margin-left: 1rem;
  min-height: calc(100vh - 3rem);
  transition: all 0.3s ease;
`;

const PageTransition = styled(motion.div)`
  height: 100%;
`;

const PatientDashboardLayout = () => {
  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Container>
      <PatientSidebar />
      <MainContent
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageTransition
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
        >
          <Outlet />
        </PageTransition>
      </MainContent>
    </Container>
  );
};

export default PatientDashboardLayout;
