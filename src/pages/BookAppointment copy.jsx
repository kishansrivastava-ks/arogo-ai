/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

const BookAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const { data } = await API.get(`/doctors/${id}`);
        setDoctor(data.data);
      } catch (error) {
        console.error("Error fetching doctor details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }

    try {
      await API.post("/appointments/book", {
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
      });
      alert("Appointment booked successfully!");
      navigate("/dashboard/patient/appointments");
    } catch (error) {
      alert("Error booking appointment.");
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container>
      <h2>Book Appointment with Dr. {doctor?.user.name}</h2>
      <p>
        <strong>Specialty:</strong> {doctor?.specialty}
      </p>
      <p>
        <strong>Location:</strong> {doctor?.location.city},{" "}
        {doctor?.location.state}
      </p>

      <Label>Select Date:</Label>
      <Select onChange={(e) => setSelectedDate(e.target.value)}>
        <option value="">Select a date</option>
        {doctor?.availability.map((slot, index) => (
          <option key={index} value={slot.date}>
            {slot.date}
          </option>
        ))}
      </Select>

      <Label>Select Time Slot:</Label>
      <Select
        onChange={(e) => setSelectedTime(e.target.value)}
        disabled={!selectedDate}
      >
        <option value="">Select a time</option>
        {selectedDate &&
          doctor?.availability
            .find((slot) => slot.date === selectedDate)
            ?.slots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
      </Select>

      <ConfirmButton onClick={handleConfirmBooking}>
        Confirm Booking
      </ConfirmButton>
    </Container>
  );
};

export default BookAppointment;

const Container = styled.div`
  padding: 2rem;
  max-width: 700px;
  margin: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const ConfirmButton = styled.button`
  background: #0077b6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: #005f8f;
  }
`;
