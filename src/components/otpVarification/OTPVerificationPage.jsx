import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get user data from location state
  const userData = location.state || {};

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:3003/auth/verify-otp', 
        { 
          email: userData.email, 
          otp, 
          userData 
        },
        { withCredentials: true }
      );

      // Login user after successful verification
      login({
        email: userData.email,
        role: userData.role,
        name: userData.name,
        profileCompleted: false
      });

      // Redirect based on role
      if (userData.role.toLowerCase() === 'student') {
        navigate('/signup/student', { state: userData });
      } else if (userData.role.toLowerCase() === 'faculty') {
        navigate('/signup/faculty', { state: userData });
      } else if (userData.role.toLowerCase() === 'company') {
        navigate('/signup/company', { state: userData });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post(
        'http://localhost:3003/auth/request-otp', 
        { email: userData.email }
      );
      alert('New OTP sent to your email');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">OTP Verification</h2>
        <p className="text-center mb-4 text-gray-600">
          Enter the 6-digit OTP sent to {userData.email}
        </p>
        <form onSubmit={handleOTPSubmit} className="space-y-4">
          <input 
            type="text" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={resendOTP}
            className="text-blue-500 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;