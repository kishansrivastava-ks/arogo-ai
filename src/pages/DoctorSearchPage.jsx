import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import DoctorCard from "../components/DoctorCard";
import { FiSearch, FiMapPin, FiBriefcase, FiX } from "react-icons/fi";

const DoctorSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    fetchRandomDoctors();
  }, []);

  const fetchRandomDoctors = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors`);
      setDoctors(data.data);
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorsByName = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors/search`, {
        params: { name: searchQuery },
      });
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
    setShowDropdown(false);
  };

  const fetchDoctorsBySpecialty = async () => {
    if (!specialty) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors/search`, {
        params: { specialty },
      });
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorsByLocation = async () => {
    if (!location) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors/search`, {
        params: { city: location },
      });
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchDoctorsByName();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchRandomDoctors();
  };

  const specialties = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
  ];

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader>
        <SearchTitle>Find Your Doctor</SearchTitle>
        <SearchDescription>
          Search for doctors by name, specialty, or location
        </SearchDescription>
      </PageHeader>

      <SearchSection>
        <MainSearchContainer>
          <SearchInputWrapper>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <MainSearchInput
              type="text"
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
            />
            {searchQuery && (
              <ClearButton
                onClick={clearSearch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX />
              </ClearButton>
            )}
          </SearchInputWrapper>

          <SearchButtonStyled
            onClick={fetchDoctorsByName}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiSearch size={16} />
            <span>Search</span>
          </SearchButtonStyled>

          <AnimatePresence>
            {showDropdown && searchQuery.length > 0 && (
              <DropdownContainer
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {doctors
                  .filter((doctor) =>
                    doctor.user.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((doctor) => (
                    <DropdownItem
                      key={doctor._id}
                      onClick={() => {
                        setSearchQuery(doctor.user.name);
                        setFilteredDoctors([doctor]);
                        setShowDropdown(false);
                      }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                    >
                      <strong>{doctor.user.name}</strong>
                      <DropdownDetails>
                        <SpecialtyBadge>{doctor.specialty}</SpecialtyBadge>
                      </DropdownDetails>
                    </DropdownItem>
                  ))}
                {doctors.filter((doctor) =>
                  doctor.user.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <NoResultsItem>No matching doctors found</NoResultsItem>
                )}
              </DropdownContainer>
            )}
          </AnimatePresence>
        </MainSearchContainer>

        <FiltersContainer>
          <FilterSection>
            <FilterHeader>
              <FilterIcon>
                <FiBriefcase size={14} />
              </FilterIcon>
              <span>Specialty</span>
            </FilterHeader>
            <SpecialtyFilters>
              {specialties.map((spec) => (
                <SpecialtyChip
                  key={spec}
                  selected={specialty === spec}
                  onClick={() => {
                    setSpecialty(specialty === spec ? "" : spec);
                    setActiveFilter("specialty");
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {spec}
                </SpecialtyChip>
              ))}
            </SpecialtyFilters>
          </FilterSection>

          <FilterSection>
            <FilterHeader>
              <FilterIcon>
                <FiMapPin size={14} />
              </FilterIcon>
              <span>Location</span>
            </FilterHeader>
            <LocationInputGroup>
              <LocationInput
                type="text"
                placeholder="Enter city name"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setActiveFilter("location");
                }}
                onKeyPress={(e) =>
                  e.key === "Enter" && fetchDoctorsByLocation()
                }
              />
              <LocationSearchButton
                onClick={fetchDoctorsByLocation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!location}
              >
                <FiSearch size={16} />
              </LocationSearchButton>
            </LocationInputGroup>
          </FilterSection>

          <ApplyFiltersButton
            onClick={() => {
              if (activeFilter === "specialty") fetchDoctorsBySpecialty();
              else if (activeFilter === "location") fetchDoctorsByLocation();
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!specialty && !location}
          >
            Apply Filters
          </ApplyFiltersButton>
        </FiltersContainer>
      </SearchSection>

      <ResultsContainer>
        <ResultsHeader>
          <ResultsCount>{filteredDoctors.length} doctors found</ResultsCount>
        </ResultsHeader>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Searching for doctors...</LoadingText>
          </LoadingContainer>
        ) : (
          <DoctorGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))
            ) : (
              <NoResultsContainer>
                <NoResultsIcon>🔍</NoResultsIcon>
                <NoResultsText>
                  No doctors found matching your criteria.
                </NoResultsText>
                <ResetSearchButton
                  onClick={fetchRandomDoctors}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Reset Search
                </ResetSearchButton>
              </NoResultsContainer>
            )}
          </DoctorGrid>
        )}
      </ResultsContainer>
    </PageContainer>
  );
};

export default DoctorSearchPage;

const PageContainer = styled(motion.div)`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #023e8a, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchSection = styled.div`
  margin-bottom: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid rgba(0, 119, 182, 0.1);
`;

const MainSearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  background: #f8f9fa;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #0096c7;
    box-shadow: 0 0 0 4px rgba(0, 150, 199, 0.15);
    background: white;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  padding: 0 0.75rem;
`;

const MainSearchInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 0.9rem 0.75rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #212529;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ClearButton = styled(motion.button)`
  background: none;
  border: none;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const SearchButtonStyled = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #0077b6, #0096c7);
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 119, 182, 0.2);

  @media (max-width: 768px) {
    margin-top: 0.75rem;
  }
`;

const DropdownContainer = styled(motion.div)`
  position: absolute;
  width: calc(100% - 9rem);
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 20;
  overflow: hidden;
  border: 1px solid #e9ecef;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownItem = styled(motion.div)`
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f5;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DropdownDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const SpecialtyBadge = styled.span`
  background: #e9f7fc;
  color: #0096c7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const NoResultsItem = styled.div`
  padding: 1rem;
  color: #6c757d;
  text-align: center;
  font-style: italic;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
`;

const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0077b6;
`;

const SpecialtyFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SpecialtyChip = styled(motion.button)`
  background: ${(props) => (props.selected ? "#0096c7" : "#f1f3f5")};
  color: ${(props) => (props.selected ? "white" : "#495057")};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${(props) => (props.selected ? "600" : "400")};
`;

const LocationInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LocationInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 0.95rem;
  background: #f8f9fa;
  transition: all 0.2s ease;
  color: #000;

  &:focus {
    outline: none;
    border-color: #0096c7;
    box-shadow: 0 0 0 3px rgba(0, 150, 199, 0.15);
    background: white;
  }
`;

const LocationSearchButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f5;
  color: #495057;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ApplyFiltersButton = styled(motion.button)`
  background: ${(props) =>
    props.disabled ? "#f1f3f5" : "linear-gradient(to right, #0077b6, #0096c7)"};
  color: ${(props) => (props.disabled ? "#adb5bd" : "white")};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0 4px 10px rgba(0, 119, 182, 0.2)"};
  align-self: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
  }
`;

const ResultsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid rgba(0, 119, 182, 0.1);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5;
`;

const ResultsCount = styled.div`
  font-weight: 600;
  color: #495057;
`;

const DoctorGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #f1f3f5;
  border-radius: 50%;
  border-top-color: #0096c7;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #6c757d;
  font-size: 1rem;
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  grid-column: 1 / -1;
  text-align: center;
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const ResetSearchButton = styled(motion.button)`
  background: #f1f3f5;
  color: #495057;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;
