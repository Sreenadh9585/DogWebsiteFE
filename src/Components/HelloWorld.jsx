import React from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, Heart, Search } from "lucide-react";

export default function HelloWorld() {
  const navigate = useNavigate();

  const handleEntry = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 ">
      <div className="max-w-3xl text-center">
        <div className="flex justify-center items-center mb-6" style={{marginTop: "100px"}}>
          <PawPrint className="w-12 h-12 text-blue-500" />
          <Heart className="w-8 h-8 text-red-500 mx-2" />
          <span className="text-4xl font-bold text-blue-600">PawMatcher</span>
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Find Your Perfect Furry Friend
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Welcome to PawMatcher, where every tail tells a story and every home
          finds its perfect companion. Start your journey to meet your new best
          friend today.
        </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <PawPrint className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Easy Adoption</h3>
            <p className="text-gray-600">
              Simple process to welcome your new friend home
            </p>
          </div>

        <button
          onClick={handleEntry}
          className="btn btn-primary"
        >
          Let's Get Started <span> </span>
          <PawPrint className="w-6 h-6 inline-block ml-2" />
        </button>
      </div>
    </div>
  );
}