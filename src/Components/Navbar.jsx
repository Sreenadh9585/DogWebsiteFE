import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const navigate= useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post("https://frontend-take-home-service.fetch.com/auth/logout", {}, {
                withCredentials: true
            });
            console.log(response);
            if (response.status === 200) {
                console.log("User logged out");
            }
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <p className="navbar-brand d-flex align-items-center pt-3">
          <FontAwesomeIcon 
            icon={faPaw} 
            className="me-2" 
            size="lg" 
            style={{ transform: "rotate(-15deg)" }} 
          />
          <span className="fw-bold">Pawsome Pals</span>
        </p>
        <button 
          className="btn btn-outline-light ms-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
