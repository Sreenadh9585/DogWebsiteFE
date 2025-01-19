import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faFilter, faSearch, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';
import DogListing from "./ShowData";

const SearchBreed = () => {
    const [filterDropDownStatus, setfilterDropDownStatus] = useState(false);
    const [sortFilter, setSortFilter] = useState("asc");
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(40);
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [availableBreeds, setAvailableBreeds] = useState([]);
    const [showData, setShowData] = useState(false);
    const [currentResponsePage, setResponsePage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const response = await axios.get(
                    "https://frontend-take-home-service.fetch.com/dogs/breeds",
                    { withCredentials: true }
                );
                setAvailableBreeds(response.data);
            } catch (error) {
                setError("Failed to load breeds");
            }
        };
        fetchBreeds();
    }, []);

    const handleMinAgeChange = (e) => {
        const newMinAge = parseInt(e.target.value);
        if (newMinAge > maxAge) {
            setError("Min age should be smaller than Max Age");
            return;
        }
        setError(null);
        setMinAge(newMinAge);
    };

    const handleMaxAgeChange = (e) => {
        const newMaxAge = parseInt(e.target.value);
        if (newMaxAge < minAge) {
            setError("Max age should be greater than Min Age");
            return;
        }
        setError(null);
        setMaxAge(newMaxAge);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchDogs(currentPageNumber);
    };

    const fetchDogs = async (pageNumber) => {
        setIsLoading(true);
        setError(null);

        if (selectedBreeds.length === 0) {
            setError("Please select at least one breed to search");
            setIsLoading(false);
            return;
        }

        const RequestParameters = {
            breeds: selectedBreeds,
            ageMin: parseInt(minAge),
            ageMax: parseInt(maxAge),
            size: 9,
            from: pageNumber,
            sort: `breed:${sortFilter}`
        };

        try {
            const response = await axios.get(
                "https://frontend-take-home-service.fetch.com/dogs/search",
                { 
                    params: RequestParameters,
                    withCredentials: true
                }
            );
            
            if (response.status === 200) {
                setResponsePage(response.data);
                setShowData(true);
                setHasNextPage(response.data.resultIds.length === 9);
                setHasPrevPage(pageNumber > 0);
                setCurrentPageNumber(pageNumber);
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while fetching data");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (currentPageNumber > 0) {
            fetchDogs(currentPageNumber - 9);
        }
    };

    const handleNextPage = () => {
        fetchDogs(currentPageNumber + 9);
    };

    const handleBreedSelect = (breed) => {
        if (!selectedBreeds.includes(breed)) {
            setSelectedBreeds([...selectedBreeds, breed]);
        }
        setSearchTerm("");
    };

    const removeBreed = (breedToRemove) => {
        setSelectedBreeds(selectedBreeds.filter(breed => breed !== breedToRemove));
    };

    const filteredBreeds = availableBreeds.filter(breed => 
        breed.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedBreeds.includes(breed)
    );

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-8">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search breeds..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setSearchTerm("")}
                                    />
                                    {searchTerm && (
                                        <div className="position-absolute w-100 mt-1 shadow-sm bg-white border rounded-2 z-3" 
                                             style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredBreeds.map((breed, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 hover-bg-light cursor-pointer"
                                                    onClick={() => handleBreedSelect(breed)}
                                                    style={{ cursor: 'pointer' }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = ''}
                                                >
                                                    {breed}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="col-12 col-md-4">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() => setfilterDropDownStatus(!filterDropDownStatus)}
                                >
                                    <FontAwesomeIcon icon={faFilter} className="me-2" />
                                    {filterDropDownStatus ? 'Hide Filters' : 'Show Filters'}
                                </button>
                            </div>
                        </div>

                        {selectedBreeds.length > 0 && (
                            <div className="mb-4">
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedBreeds.map((breed, index) => (
                                        <span key={index} className="badge bg-primary">
                                            {breed}
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white ms-2"
                                                onClick={() => removeBreed(breed)}
                                                style={{ fontSize: '0.5rem' }}
                                            ></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rest of your existing code for filters, error messages, and pagination remains the same */}
                        {filterDropDownStatus && (
                            <div className="card bg-light">
                                <div className="card-body">
                                    <div className="row g-4">
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Sort Order</label>
                                            <select
                                                className="form-select"
                                                value={sortFilter}
                                                onChange={(e) => setSortFilter(e.target.value)}
                                            >
                                                <option value="asc">
                                                    <FontAwesomeIcon icon={faSortAlphaDown} /> A to Z
                                                </option>
                                                <option value="desc">
                                                    <FontAwesomeIcon icon={faSortAlphaUp} /> Z to A
                                                </option>
                                            </select>
                                        </div>
                                        
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Minimum Age: {minAge}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max="40"
                                                value={minAge}
                                                onChange={handleMinAgeChange}
                                            />
                                        </div>
                                        
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Maximum Age: {maxAge}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="0"
                                                max="40"
                                                value={maxAge}
                                                onChange={handleMaxAgeChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="mt-4">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                                        Search Dogs
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showData && (
                <div className="mt-4">
                    <DogListing breeds={currentResponsePage} />
                    
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handlePrevPage}
                            disabled={!hasPrevPage || isLoading}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                            Previous
                        </button>

                        <div className="text-center">
                            <span className="badge bg-secondary">
                                Page {Math.floor(currentPageNumber / 9) + 1}
                            </span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleNextPage}
                            disabled={!hasNextPage || isLoading}
                        >
                            Next
                            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBreed;