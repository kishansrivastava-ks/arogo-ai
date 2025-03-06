// import { useContext } from "react";
import styled from "styled-components";
import AuthContext, { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const PatientDashboard = () => {
  const { user, isLoading } = useAuth();
  console.log(user);

  if (isLoading) {
    return <p>Loading...</p>; // Replace this with a proper loader component
  }
  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      key={user?.email || "default"}
    >
      <GradientCard>
        <ProfileHeader>
          <WelcomeSection>
            <UserAvatar>{user?.name?.charAt(0) || "U"}</UserAvatar>
            <div>
              <WelcomeText
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Welcome back,
              </WelcomeText>
              <UserName
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {user?.name || "Patient"}
              </UserName>
            </div>
          </WelcomeSection>
          <StatusBadge
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          >
            Active
          </StatusBadge>
        </ProfileHeader>
        <ContactInfoCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <InfoLabel>Email Address</InfoLabel>
          <InfoValue>{user?.email || "Not provided"}</InfoValue>
        </ContactInfoCard>
      </GradientCard>
    </DashboardContainer>
  );
};

export default PatientDashboard;

// Styled Components
const DashboardContainer = styled(motion.div)`
  width: 100%;
  width: 70vw;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const GradientCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
`;

const WelcomeText = styled(motion.p)`
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
`;

const UserName = styled(motion.h2)`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const StatusBadge = styled(motion.div)`
  background-color: #10b981;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
`;

const ContactInfoCard = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 1.25rem;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const InfoLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
`;

const InfoValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;
