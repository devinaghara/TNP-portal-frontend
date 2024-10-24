import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    studentId: '123456',
    collegeName: 'ABC University',
    department: 'Computer Science',
    email: 'johndoe@gmail.com',
    cgpa: '9.5',
    interestedDomains: ['Web Development', 'AI', 'Machine Learning'],
    mobileNumber: '9876543210',
    sscResult: '85%',
    hscResult: '80%',
    diplomaResult: 'N/A',
    sgpa: ['9.0', '8.8', '8.7', '9.2', '9.1', '8.9', '9.3', '9.5'], // SGPA for 8 semesters
    backlogs: 1,
    profilePhoto: '', // Added profile photo field
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [profilePhoto, setProfilePhoto] = useState(null); // State for profile photo

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
      interestedDomains: value.split(',').map((domain) => domain.trim()),
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

  const saveChanges = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditedUser(user);
    setIsEditing(false);
    setProfilePhoto(user.profilePhoto);
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
              name="department"
              value={editedUser.department}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.department}</p>
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
              name="interestedDomains"
              value={editedUser.interestedDomains.join(', ')}
              onChange={handleInterestedDomainsChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.interestedDomains.join(', ')}</p>
          )}
        </div>

        {/* SGPA for 8 Semesters */}
        <div className="md:col-span-2 border p-4 rounded">
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
        </div>

        {/* Backlogs */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Backlogs</h3>
          {isEditing ? (
            <input
              type="number"
              name="backlogs"
              value={editedUser.backlogs}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          ) : (
            <p>{user.backlogs}</p>
          )}
        </div>
      </div>

      <div className="text-center mt-6">
        {isEditing ? (
          <div>
            <button
              onClick={saveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={cancelEditing}
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
  );
};

export default ProfilePage;
