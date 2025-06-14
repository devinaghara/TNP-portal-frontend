import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext'; // Add this import

const SignUpPage = () => {
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      // Request OTP before full registration
      const otpResponse = await axios.post(
        "http://localhost:3003/auth/request-otp",
        { email: data.email },
        { withCredentials: true }
      );

      // Navigate to OTP verification page with user data
      navigate("/verify-otp", {
        state: {
          email: data.email,
          password: data.password,
          name: data.name,
          role: role,
          ...(role === "Student" && { idNumber: data.idNo }),
          ...(role === "Company" && {
            companyName: data.name,
            hrName: data.hrName
          })
        }
      });
    } catch (error) {
      console.error("Sign Up OTP Request error:", error);
      if (error.response?.data?.message) {
        setError("server", { message: error.response.data.message });
      } else {
        setError("server", {
          message: "An unexpected error occurred. Please try again.",
        });
      }
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
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            {/* Conditional Fields */}
            {role === "Student" && (
              <div className="flex mb-6 space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="idNo"
                    className="block text-gray-700 mb-2"
                  >
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNo"
                    {...register("idNo", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {errors.idNumber && (
                    <span className="text-red-500">ID Number is required</span>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="studentName"
                    className="block text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    {...register("name", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {errors.name && (
                    <span className="text-red-500">Name is required</span>
                  )}
                </div>
              </div>
            )}
            {role === "Faculty" && (
              <div className="mb-4">
                <label
                  htmlFor="facultyName"
                  className="block text-gray-700 mb-2"
                >
                  Faculty Name
                </label>
                <input
                  type="text"
                  id="facultyName"
                  {...register("name", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {errors.name && (
                  <span className="text-red-500">Name is required</span>
                )}
              </div>
            )}
            {role === "Company" && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="companyName"
                    className="block text-gray-700 mb-2"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    {...register("name", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {errors.name && (
                    <span className="text-red-500">
                      Company Name is required
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="hrName" className="block text-gray-700 mb-2">
                    HR Name
                  </label>
                  <input
                    type="text"
                    id="hrName"
                    {...register("hrName", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {errors.hrName && (
                    <span className="text-red-500">HR Name is required</span>
                  )}
                </div>
              </>
            )}
            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.email && (
                <span className="text-red-500">Email is required</span>
              )}
            </div>
            {/* Password Field */}
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500">Password is required</span>
              )}
            </div>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Role</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="student"
                    name="role"
                    value="Student"
                    className="mr-2"
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="student" className="text-gray-700">
                    Student
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="faculty"
                    name="role"
                    value="Faculty"
                    className="mr-2"
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="faculty" className="text-gray-700">
                    Faculty
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="company"
                    name="role"
                    value="Company"
                    className="mr-2"
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="company" className="text-gray-700">
                    Company
                  </label>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center mt-6">
              <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 mt-4">
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign up with Google
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-700">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
