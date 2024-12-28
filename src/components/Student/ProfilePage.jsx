import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    studentId: '',
    collegeName: '',
    departmentName: '',
    email: '',
    cgpa: '',
    interestedDomain: [],
    mobileNumber: '',
    sscResult: '',
    hscResult: '',
    diplomaResult: '',
    sgpa: [],
    noOfBacklog: 0,
    profilePhoto: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get('http://localhost:3003/auth/student/details', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json', 
        }
      });

      if (response.data.success) {
        const studentData = response.data.data;
        console.log(studentData.cgpa)
        setUser({
          name: studentData.name || '',
          studentId: studentData.studentId || '',
          collegeName: studentData.collageName || '',
          departmentName: studentData.departmentName || '',
          email: studentData.email || '',
          cgpa: studentData.cgpa || '',
          interestedDomain: studentData.interestedDomain || [],
          mobileNumber: studentData.mobileNumber || '',
          sscResult: studentData.sscResult || '',
          hscResult: studentData.hscResult || '',
          diplomaResult: studentData.diplomaResult || '',
          sgpa: studentData.sgpa ? Object.values(studentData.sgpa) : [],
          noOfBacklog: studentData.noOfBacklog || 0,
          profilePhoto: studentData.profilePhoto || '',
        });

        setEditedUser(studentData);
      }
    } catch (err) {
      // Error handling
      if (err.response?.status === 401) {
        setError('Please log in to view your profile');
      } else {
        setError('Failed to fetch student details');
      }
      console.error('Error fetching student details:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    setSaveStatus({ loading: true, error: null });
    try {
      const formData = new FormData();
      
      // Clean up the data before sending
      const dataToSend = {
        ...editedUser,
        // Convert numeric strings to numbers where needed
        sscResult: Number(editedUser.sscResult),
        hscResult: Number(editedUser.hscResult),
        diplomaResult: editedUser.diplomaResult ? Number(editedUser.diplomaResult) : undefined,
        cgpa: Number(editedUser.cgpa),
        noOfBacklog: Number(editedUser.noOfBacklog),
        // Ensure arrays are properly formatted
        interestedDomain: Array.isArray(editedUser.interestedDomain) 
          ? editedUser.interestedDomain 
          : editedUser.interestedDomain.split(',').map(item => item.trim()),
        sgpa: Array.isArray(editedUser.sgpa) 
          ? editedUser.sgpa.map(Number)
          : editedUser.sgpa.split(',').map(item => Number(item.trim()))
      };
  
      // Append all user data to formData
      Object.keys(dataToSend).forEach(key => {
        if (key === 'interestedDomain' || key === 'sgpa') {
          formData.append(key, JSON.stringify(dataToSend[key]));
        } else if (dataToSend[key] !== undefined && dataToSend[key] !== '') {
          formData.append(key, dataToSend[key]);
        }
      });
  
      // Handle profile photo separately
      if (profilePhoto && profilePhoto.startsWith('data:image')) {
        const response = await fetch(profilePhoto);
        const blob = await response.blob();
        formData.append('profilePhoto', blob, 'profile.jpg');
      }
  
      const response = await axios.put(
        'http://localhost:3003/auth/student/update',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data.success) {
        setUser(dataToSend);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to update profile',
      });
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveStatus({ loading: false, error: null });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestedDomainsChange = (e) => {
    const { value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      interestedDomain: value.split(',').map((domain) => domain.trim()),
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setEditedUser((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelEditing = () => {
    setEditedUser(user);
    setIsEditing(false);
    setProfilePhoto(user.profilePhoto);
    setSaveStatus({ loading: false, error: null });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      {/* Profile Header */}
      <div className="text-center mb-6">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="inline-block rounded-full h-24 w-24 object-cover"
          />
        ) : (
          <FaUserCircle className="inline-block text-gray-400 h-24 w-24" />
        )}
        <h2 className="text-2xl font-bold mt-2">{user.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editable Photo Upload */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Profile Photo</h3>
          {isEditing ? (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.profilePhoto ? 'Profile photo uploaded' : 'No profile photo uploaded'}</p>
          )}
        </div>

        {/* Name Field */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Name</h3>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.name}</p>
          )}
        </div>

        {/* Student ID Field */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Student ID</h3>
          {isEditing ? (
            <input
              type="text"
              name="studentId"
              value={editedUser.studentId}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.studentId}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Email</h3>
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        {/* Mobile Number Field */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Mobile Number</h3>
          {isEditing ? (
            <input
              type="text"
              name="mobileNumber"
              value={editedUser.mobileNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.mobileNumber}</p>
          )}
        </div>

        {/* College Name */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">College</h3>
          {isEditing ? (
            <input
              type="text"
              name="collegeName"
              value={editedUser.collegeName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.collegeName}</p>
          )}
        </div>

        {/* Department */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Department</h3>
          {isEditing ? (
            <input
              type="text"
              name="departmentName"
              value={editedUser.departmentName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.departmentName}</p>
          )}
        </div>

        {/* SSC Result */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">SSC Result</h3>
          {isEditing ? (
            <input
              type="text"
              name="sscResult"
              value={editedUser.sscResult}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.sscResult}</p>
          )}
        </div>

        {/* HSC Result */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">HSC Result</h3>
          {isEditing ? (
            <input
              type="text"
              name="hscResult"
              value={editedUser.hscResult}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.hscResult}</p>
          )}
        </div>

        {/* CGPA */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">CGPA</h3>
          {isEditing ? (
            <input
              type="text"
              name="cgpa"
              value={editedUser.cgpa}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.cgpa}</p>
          )}
        </div>

        {/* Interested Domains */}
        <div className="md:col-span-2 border p-4 rounded">
          <h3 className="font-semibold mb-2">Interested Domains</h3>
          {isEditing ? (
            <input
              type="text"
              name="interestedDomain"
              value={editedUser.interestedDomain.join(', ')}
              onChange={handleInterestedDomainsChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.interestedDomain.join(', ')}</p>
          )}
        </div>

        {/* SGPA for 8 Semesters */}
        {/* <div className="md:col-span-2 border p-4 rounded">
          <h3 className="font-semibold mb-2">SGPA (All 8 Semesters)</h3>
          {isEditing ? (
            <input
              type="text"
              name="sgpa"
              value={editedUser.sgpa.join(', ')}
              onChange={(e) =>
                setEditedUser((prev) => ({
                  ...prev,
                  sgpa: e.target.value.split(', '),
                }))
              }
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {user.sgpa.map((sem, index) => (
                <div key={index} className="border p-2 text-center rounded">
                  <p>Sem {index + 1}</p>
                  <p className="font-semibold">{sem}</p>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* SGPA for 8 Semesters */}
        <div className="md:col-span-2 border p-4 rounded">
          <h3 className="font-semibold mb-2">SGPA (All 8 Semesters)</h3>
          {isEditing ? (
            <input
              type="text"
              name="sgpa"
              value={Array.isArray(editedUser.sgpa) ? editedUser.sgpa.join(', ') : ''}
              onChange={(e) =>
                setEditedUser((prev) => ({
                  ...prev,
                  sgpa: e.target.value.split(', ').filter(item => item !== ''),
                }))
              }
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {Array.isArray(user.sgpa) && user.sgpa.map((sem, index) => (
                <div key={index} className="border p-2 text-center rounded">
                  <p>Sem {index + 1}</p>
                  <p className="font-semibold">{sem}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backlogs */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Backlogs</h3>
          {isEditing ? (
            <input
              type="number"
              name="noOfBacklog"
              value={editedUser.noOfBacklog}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.noOfBacklog}</p>
          )}
        </div>
      </div>

      <div className="text-center mt-6">
        {isEditing ? (
          <div>
            <button
              onClick={saveChanges}
              disabled={saveStatus.loading}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 ${saveStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
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

      {/* Error message display */}
      {saveStatus.error && (
        <div className="text-red-500 text-center mt-4">{saveStatus.error}</div>
      )}
    </div>
  );
};

export default ProfilePage;