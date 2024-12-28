import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const ProfilePopup = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });
  const [profileImage, setProfileImage] = useState(null);
  const [facultyData, setFacultyData] = useState({
    name: '',
    facultyId: '',
    collageName: '',
    departmentName: '',
    email: '',
    mobileNumber: '',
    linkedinProfile: '',
    profilePhoto: ''
  });
  
  const [editedFacultyData, setEditedFacultyData] = useState(facultyData);

  useEffect(() => {
    fetchFacultyDetails();
  }, []);

  const fetchFacultyDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3003/auth/faculty/details', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        const data = response.data.data;
        setFacultyData(data);
        setEditedFacultyData(data);
        if (data.profilePhoto) {
          setProfileImage(data.profilePhoto);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch faculty details');
      console.error('Error fetching faculty details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFacultyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setEditedFacultyData(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    setSaveStatus({ loading: true, error: null });
    try {
      const formData = new FormData();
      
      Object.keys(editedFacultyData).forEach(key => {
        if (editedFacultyData[key] !== undefined && editedFacultyData[key] !== '') {
          formData.append(key, editedFacultyData[key]);
        }
      });

      if (profileImage && profileImage !== facultyData.profilePhoto) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        formData.append('profilePhoto', blob, 'profile.jpg');
      }

      const response = await axios.put(
        'http://localhost:3003/auth/faculty/update',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setFacultyData(editedFacultyData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      setSaveStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to update profile'
      });
      alert('Failed to update profile');
    } finally {
      setSaveStatus({ loading: false, error: null });
    }
  };

  const cancelEditing = () => {
    setEditedFacultyData(facultyData);
    setIsEditing(false);
    setProfileImage(facultyData.profilePhoto);
    setSaveStatus({ loading: false, error: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="text-gray-600 font-medium">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        
        <div>
          <div className="flex flex-col items-center mb-6">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="rounded-full w-24 h-24 object-cover"
              />
            ) : (
              <FaUserCircle size={96} className="text-gray-600" />
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2"
              />
            )}
          </div>
          
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">Name</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedFacultyData.name}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : facultyData.name}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">Faculty ID</td>
                <td className="border px-4 py-2">{facultyData.facultyId}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">Email</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedFacultyData.email}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : facultyData.email}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">College</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <select
                      name="collageName"
                      value={editedFacultyData.collageName}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="Depstar">Depstar</option>
                      <option value="CSPIT">CSPIT</option>
                    </select>
                  ) : facultyData.collageName}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">Department</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <select
                      name="departmentName"
                      value={editedFacultyData.departmentName}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="CSE">CSE</option>
                      <option value="CE">CE</option>
                      <option value="IT">IT</option>
                    </select>
                  ) : facultyData.departmentName}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">Mobile Number</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="mobileNumber"
                      value={editedFacultyData.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : facultyData.mobileNumber}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-gray-50 font-medium">LinkedIn Profile</td>
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={editedFacultyData.linkedinProfile}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <a 
                      href={facultyData.linkedinProfile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {facultyData.linkedinProfile}
                    </a>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center mt-6">
            {isEditing ? (
              <div>
                <button
                  onClick={saveChanges}
                  disabled={saveStatus.loading}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 ${
                    saveStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saveStatus.loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={saveStatus.loading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;