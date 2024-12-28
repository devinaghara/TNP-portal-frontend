import axios from "axios";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3003/auth/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      login(response.data);

      if (response.data.ProfileCompleted) {
        if (response.data.role === "student") {
          navigate("/");
        } else {
          navigate(`/${response.data.role}`);
        }
      } else {
        navigate(`/signup/${response.data.role}`, {
          state: { email, role: response.data.role },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-in clicked");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess("");

    if (!forgotPasswordEmail) {
      setForgotPasswordError("Please enter your email");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3003/auth/resetemail",
        { email: forgotPasswordEmail },
        { withCredentials: true }
      );

      setForgotPasswordSuccess(response.data.message);

      // Clear email and hide modal after 3 seconds
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setForgotPasswordEmail("");
      }, 3000);
    } catch (error) {
      setForgotPasswordError(
        error.response?.data?.message ||
        "An error occurred. Please try again."
      );
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
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </form>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center mt-6">
              <button
                className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 mt-4"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>

            <p className="text-gray-700 mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

            {forgotPasswordError && (
              <p className="text-red-500 text-center mb-4">{forgotPasswordError}</p>
            )}

            {forgotPasswordSuccess && (
              <p className="text-green-500 text-center mb-4">{forgotPasswordSuccess}</p>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label htmlFor="forgotEmail" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="forgotEmail"
                  name="forgotEmail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;