import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const FacultySignUpPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");

  // Initialize form data with values from state
  const [formData, setFormData] = useState({
    name: state?.name || "",
    facultyId: "",
    collageName: "",
    departmentName: "",
    mobileNumber: "",
    linkedinProfile: "",
    email: state?.email || "",
  });

  const role = state?.role || "";

  useEffect(() => {
    // Redirect to signup if no email/role or if role isn't Faculty
    if (!state?.email || !role || !["Faculty", "faculty"].includes(role)) {
      navigate("/signup");
    }
  }, [state?.email, role, navigate]);

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.facultyId.trim()) return "Faculty ID is required";
    if (!formData.collageName) return "College Name is required";
    if (!formData.departmentName) return "Department Name is required";
    if (!formData.mobileNumber.trim()) return "Mobile Number is required";
    if (!formData.linkedinProfile.trim()) return "LinkedIn Profile is required";
    
    // Indian mobile number validation (10 digits, optionally starting with +91)
    const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber.replace(/\s/g, ''))) {
      return "Please enter a valid Indian mobile number";
    }

    // LinkedIn URL validation
    if (!formData.linkedinProfile.includes('linkedin.com')) {
      return "Please enter a valid LinkedIn profile URL";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create faculty data object matching backend expectations
    const facultyData = {
      email: formData.email,
      name: formData.name,
      facultyId: formData.facultyId,
      collageName: formData.collageName,
      departmentName: formData.departmentName,
      mobileNumber: formData.mobileNumber.replace(/\s/g, ''),
      linkedinProfile: formData.linkedinProfile,
    };

    try {
      const response = await axios.post(
        "http://localhost:3003/auth/add/faculty",
        facultyData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        login(response.data);
        console.log("Faculty registration successful:", response.data);
        navigate("/"); // Update with your actual faculty dashboard route
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Failed to register faculty. Please try again.");
    }
  };
  
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/ddxe0b0kf/image/upload/v1723373873/ps538j7lnfoqyb9uolyo.jpg)",
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Faculty Details
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Faculty Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                readOnly
              />
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                readOnly
              />
            </div>

            {/* Faculty ID Field */}
            <div className="mb-6">
              <label htmlFor="facultyId" className="block text-gray-700 mb-2">
                Faculty ID No.
              </label>
              <input
                type="text"
                id="facultyId"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* College Name Dropdown */}
            <div className="mb-6">
              <label htmlFor="collageName" className="block text-gray-700 mb-2">
                College Name
              </label>
              <select
                id="collageName"
                name="collageName"
                value={formData.collageName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select College</option>
                <option value="Depstar">Depstar</option>
                <option value="CSPIT">CSPIT</option>
              </select>
            </div>

            {/* Department Name Dropdown */}
            <div className="mb-6">
              <label htmlFor="departmentName" className="block text-gray-700 mb-2">
                Dept. Name
              </label>
              <select
                id="departmentName"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
              </select>
            </div>

            {/* Mobile Number Field */}
            <div className="mb-6">
              <label htmlFor="mobileNumber" className="block text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            {/* LinkedIn Profile Field */}
            <div className="mb-6">
              <label htmlFor="linkedinProfile" className="block text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedinProfile"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                placeholder="https://www.linkedin.com/in/your-profile"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacultySignUpPage;