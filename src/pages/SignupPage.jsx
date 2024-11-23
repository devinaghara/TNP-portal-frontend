import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const SignUpPage = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    clearErrors(); // Clear any previous errors when role changes
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      // First, check if role is selected
      if (!role) {
        setError("role", { 
          type: "manual",
          message: "Please select a role" 
        });
        return;
      }

      const signupData = {
        email: data.email,
        password: data.password,
        name: data.name,
        role: role.toLowerCase(),
        ...(role === "Student" && { idNumber: data.idNumber }),
        ...(role === "Company" && { hrName: data.hrName })
      };

      const response = await axios.post(
        "http://localhost:3003/auth/signup",
        signupData,
        {
          withCredentials: true,
        }
      );

      // Store user data in auth context
      login(response.data);

      // Handle navigation based on role
      switch (response.data.role) {
        case "student":
          navigate("/signup/student", {
            state: {
              email: data.email,
              role: role,
              name: data.name,
              idNo: data.idNumber,
            },
          });
          break;
        case "faculty":
          navigate("/signup/faculty", {
            state: { 
              email: data.email, 
              role: role, 
              name: data.name 
            },
          });
          break;
        case "company":
          navigate("/signup/company", {
            state: {
              email: data.email,
              role: role,
              name: data.name,
              hrName: data.hrName
            },
          });
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (error) {
      console.error("Sign Up error:", error);
      
      if (error.response?.data?.message) {
        // Handle specific server errors
        if (error.response.data.message.includes("email")) {
          setError("email", {
            type: "server",
            message: error.response.data.message
          });
        } else {
          setError("server", {
            type: "server",
            message: error.response.data.message
          });
        }
      } else {
        setError("server", {
          type: "server",
          message: "An unexpected error occurred. Please try again."
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
          
          {/* Display server errors at the top */}
          {errors.server && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.server.message}
            </div>
          )}

          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            {/* Role Selection - Moved to top */}
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
              {errors.role && (
                <span className="text-red-500 text-sm mt-1">{errors.role.message}</span>
              )}
            </div>

            {/* Conditional Fields based on role */}
            {role === "Student" && (
              <div className="flex mb-6 space-x-4">
                <div className="w-1/2">
                  <label htmlFor="idNumber" className="block text-gray-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    {...register("idNumber", { 
                      required: "ID Number is required",
                      pattern: {
                        value: /^[0-9]{8}$/,
                        message: "ID Number must be 8 digits"
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {errors.idNumber && (
                    <span className="text-red-500 text-sm">{errors.idNumber.message}</span>
                  )}
                </div>
                <div className="w-1/2">
                  <label htmlFor="studentName" className="block text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    {...register("name", { 
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                  )}
                </div>
              </div>
            )}

            {/* ... (Keep other role-specific fields as they are) ... */}

            {/* Email Field with enhanced validation */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field with enhanced validation */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  validate: validatePassword
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center mt-6">
              <button 
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100"
                onClick={() => {/* Implement Google Sign up logic */}}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign up with Google
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-700">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;