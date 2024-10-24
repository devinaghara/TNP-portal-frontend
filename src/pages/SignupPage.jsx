import { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import { useLocation, useNavigate } from "react-router-dom"; // Update import
import { useForm } from "react-hook-form"; // Import useForm
import axios from "axios"; // Import axios for requests

const SignUpPage = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm(); // Set up react-hook-form
  const { state } = useLocation();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3003/auth/signup",
        {
          email: data.email,
          password: data.password,
          name: data.name,
          role: role.toLowerCase(),
        },
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response);
      if (response.data.role == "student") {
        navigate("/signup/student", {
          state: {
            email: data.email,
            role: role,
            name: data.name,
            idNo: data.idNumber,
          },
        });
      } else if (response.data.role == "faculty") {
        navigate("/signup/faculty", {
          state: { email: data.email, role: role, name: data.name },
        });
      }
    } catch (error) {
      console.error("Sign Up error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
                    htmlFor="idNumber"
                    className="block text-gray-700 mb-2"
                  >
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    {...register("idNumber", { required: true })}
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
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
              <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100">
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
