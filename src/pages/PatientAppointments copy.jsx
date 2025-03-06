/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import API from "../services/api";
import AuthContext from "../context/AuthContext";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { FiTrash2 } from "react-icons/fi";

const PatientAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get(`/appointments/patient`);
      setAppointments(data.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    console.log(selectedAppointment);
  };

  const confirmCancellation = async () => {
    try {
      await API.post(`/appointments/cancel`, {
        data: { appointmentId: selectedAppointment._id },
      });

      setAppointments(
        appointments.filter((a) => a._id !== selectedAppointment._id)
      );
    } catch (error) {
      console.error("Error canceling appointment", error);
    }
    setShowModal(false);
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <h2>Your Appointments</h2>
      {appointments.length > 0 ? (
        <AppointmentsList>
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment._id}>
              <DoctorInfo>
                <h3>{appointment?.doctor?.user?.name}</h3>
                <p>
                  <strong>Specialty:</strong> {appointment?.doctor?.specialty}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {appointment?.doctor?.location?.city},{" "}
                  {appointment.doctor.location.state}
                </p>
              </DoctorInfo>
              <SlotInfo>
                <p>
                  <strong>Slot:</strong>{" "}
                  {`${appointment?.time} on ${appointment?.date}`}
                </p>
                <CancelButton onClick={() => handleCancelClick(appointment)}>
                  <FiTrash2 /> Cancel
                </CancelButton>
              </SlotInfo>
            </AppointmentCard>
          ))}
        </AppointmentsList>
      ) : (
        <p>No appointments found.</p>
      )}

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Cancel Appointment"
        >
          <p>Are you sure you want to cancel this appointment?</p>
          <ModalButtons>
            <CancelConfirm onClick={confirmCancellation}>
              Yes, Cancel
            </CancelConfirm>
            <CancelClose onClick={() => setShowModal(false)}>
              No, Keep
            </CancelClose>
          </ModalButtons>
        </Modal>
      )}
    </Container>
  );
};

export default PatientAppointments;

const Container = styled.div`
  padding: 2rem;
  width: 75vw;
  margin: auto;
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AppointmentCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DoctorInfo = styled.div`
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    margin: 0.2rem 0;
  }
`;

const SlotInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const CancelButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #c82333;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const CancelConfirm = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelClose = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
`;
