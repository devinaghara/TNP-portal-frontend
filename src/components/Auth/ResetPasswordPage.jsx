import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3003/auth/reset-password', 
        { token, newPassword },
        { withCredentials: true }
      );

      setSuccess(response.data.message);
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "An error occurred while resetting password"
      );
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: 
          "url(https://res.cloudinary.com/ddxe0b0kf/image/upload/v1723373873/ps538j7lnfoqyb9uolyo.jpg)"
      }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        <form onSubmit={handleResetPassword} className="flex flex-col">
          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-gray-700 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label 
              htmlFor="confirmPassword" 
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;