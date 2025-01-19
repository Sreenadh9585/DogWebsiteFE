import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faLocationDot,
    faHeart, 
    faTimes,  faCake, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const styles = `
  .heart-checkbox {
    display: none;
  }

  .heart-label {
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-left: 8px;
  }

  .heart-label:before {
    content: "♡";
    font-size: 20px;
    color: #ff0000;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .heart-checkbox:checked + .heart-label:before {
    content: "♥";
    color: #ff0000;
  }

  .heart-container {
    display: inline-flex;
    align-items: center;
  }

  .badge-with-heart {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
`;



function createData(id, img, name, age, zip_code, breed) {
  return { id, img, name, age, zip_code, breed };
}

const DogListing = ({ breeds }) => {

  

  const [dogData, setDogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDogIds, setSelectedDogIds] = useState([]);
  const [MatchedDogID, setMatchedDogID]= useState("")
  const [MatchedDog, setMatchedDog]= useState([])

  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const tooltipStyle = {
    position: 'absolute',
    transform: 'translateY(70%) translateX(-30%)',
    backgroundColor: 'black',
    color: 'white',
    padding: '5px',
    borderRadius: '3px',
    display: showTooltip ? 'block' : 'none'
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const response = await axios.post(
          "https://frontend-take-home-service.fetch.com/dogs",
          breeds.resultIds,
          { withCredentials: true }
        );

        const formattedData = response.data.map((dog) =>
          createData(dog.id, dog.img, dog.name, dog.age, dog.zip_code, dog.breed)
        );
        setDogData(formattedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (breeds?.resultIds?.length > 0) {
      fetchDogData();
    }
  }, [breeds]);

  const handleGenerateMatcher = async (e) => {
    e.preventDefault();
  
    try {
      console.log("Trying response");
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        selectedDogIds,
        { withCredentials: true }
      );
      console.log(response);
  
      const matchedDogID = response.data.match;
      setMatchedDogID(matchedDogID); 
      console.log(matchedDogID);
  
      console.log("Trying match response");
      const matchResponse = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        [matchedDogID],
        { withCredentials: true }
      );
      console.log(matchResponse.data);
  
      const matchedDog = matchResponse.data; 
      setMatchedDog(matchedDog);
      console.log(matchedDog);

      if (matchedDog.length > 0) {
        setShowModal(true);
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };
  

  const handleMouseEnter = () => {
    if (selectedDogIds.length===0) {
      setShowTooltip(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleCheckboxChange = (id) => {
    setSelectedDogIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((dogId) => dogId !== id)
        : [...prevSelected, id]
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error loading dogs: {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        {dogData.map((dog) => (
          <div className="col-12 col-sm-6 col-lg-4" key={dog.id}>
            <div className="card h-100 shadow-sm hover-card">
              <img
                src={dog.img}
                className="card-img-top"
                alt={dog.name}
                style={{ height: "240px", objectFit: "fill" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">{dog.name}</h5>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-primary pt-2">
                    <FontAwesomeIcon icon={faPaw} className="me-1" />
                    {dog.breed}
                  </span>
                  <span className="badge bg-secondary pt-2">
                    <FontAwesomeIcon icon={faCake} className="me-1" />
                    {dog.age} years
                  </span>
                  <span className="badge bg-light text-dark border badge-with-heart">
                    <FontAwesomeIcon icon={faLocationDot} className="me-1" />
                    ZIP: {dog.zip_code}
                  </span>
                  <span>
                  <div className="heart-container">
                      <input
                        type="checkbox"
                        id={`heart-${dog.id}`}
                        className="heart-checkbox"
                        checked={selectedDogIds.includes(dog.id)}
                        onChange={() => handleCheckboxChange(dog.id)}
                      />
                      <label
                        htmlFor={`heart-${dog.id}`}
                        className="heart-label"
                        aria-label="Select dog"
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* {selectedDogIds.length > 0 && (
        <div className="mt-4">
          <h6>Selected Dogs: {selectedDogIds.length}</h6>
          <pre className="bg-light p-3 rounded">
            {JSON.stringify(selectedDogIds, null, 2)}
          </pre>
        </div>
      )} */}

        
            <div
            style={{marginLeft:"550px", marginRight:"520px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >
            <button 
                type="submit" 
                className="btn btn-danger btn-lg mt-3"
                disabled={selectedDogIds.length===0}
                onClick={handleGenerateMatcher}
                >
                
                <>
                <span className="me-2" >Generate Match</span>
                <div style={tooltipStyle}>Make sure to select some paws as favourite</div>
                <FontAwesomeIcon icon={faPaw} className="me-1" />
                </>
            </button>
            </div>

            {showModal && (
  <div
    className="modal show d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    onClick={handleCloseModal}
  >
    <div
      className="modal-dialog modal-dialog-centered"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal-content border-0 shadow-lg">
        {/* Header */}
        <div className="modal-header border-0 bg-primary text-white">
          <h5 className="modal-title w-100 text-center fs-4 fw-bold">
            <span className="me-2">✨</span>
            Perfect Match Found!
            <span className="ms-2">✨</span>
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={handleCloseModal}
          />
        </div>

        {/* Body */}
        <div className="modal-body p-4">
          <div className="position-relative mb-4">
            <img
              src={MatchedDog[0].img}
              alt={`${MatchedDog[0].name} - Your matched dog`}
              className="img-fluid rounded-3 shadow-sm"
              style={{ 
                height: "300px", 
                width: "100%", 
                objectFit: "cover" 
              }}
            />
            <div className="position-absolute bottom-0 start-0 w-100 p-3"
                 style={{ 
                   background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                   borderBottomLeftRadius: "0.5rem",
                   borderBottomRightRadius: "0.5rem"
                 }}>
              <h3 className="text-white mb-0 fw-bold">{MatchedDog[0].name}</h3>
              <p className="text-white-50 mb-0">{MatchedDog[0].age} years old</p>
            </div>
          </div>

          <div className="py-3">
            <div className="d-flex justify-content-center gap-3 mb-4">
              <span className="badge bg-primary fs-6 p-2">
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                {MatchedDog[0].breed}
              </span>
              <span className="badge bg-secondary fs-6 p-2">
                <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                ZIP: {MatchedDog[0].zip_code}
              </span>
            </div>
            
            <p className="fs-5 text-center text-muted mb-0">
              <FontAwesomeIcon icon={faHeart} className="text-danger me-2" />
              We think you two would be perfect together!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer border-0 justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-lg px-5 rounded-pill"
            onClick={handleCloseModal}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        
    </div>
  );
};

export default DogListing;