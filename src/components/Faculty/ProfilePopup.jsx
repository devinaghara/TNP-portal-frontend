import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfilePopup = ({ onClose, onImageUpload }) => {
    const [selectedOption, setSelectedOption] = useState('profile');
    const [profileImage, setProfileImage] = useState(null);

    const handleOptionChange = (option) => setSelectedOption(option);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                onImageUpload(reader.result); // Call the function to update the image in SNavbar
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                    &times;
                </button>
                <div className="flex space-x-6">
                    <div className="w-1/4">
                        <ul className="space-y-4">
                            <li>
                                <button
                                    onClick={() => handleOptionChange('profile')}
                                    className={`block w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'profile' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                >
                                    Student Profile
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleOptionChange('password')}
                                    className={`block w-full text-left px-4 py-2 rounded-lg ${selectedOption === 'password' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                >
                                    Change Password
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="w-3/4">
                        {selectedOption === 'profile' && (
                            <div>
                                <div className="flex flex-col items-center mb-6">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="rounded-full w-24 h-24 object-cover" />
                                    ) : (
                                        <FaUserCircle size={96} className="text-gray-600" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="mt-2"
                                    />
                                    <button className="mt-2 text-blue-500">Upload Profile Photo</button>
                                </div>
                                <table className="w-full border-collapse border border-gray-300">
                                    <tbody>
                                        <tr>
                                            <td className="border px-4 py-2">Name</td>
                                            <td className="border px-4 py-2">John Doe</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">ID No.</td>
                                            <td className="border px-4 py-2">12345678</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">Email</td>
                                            <td className="border px-4 py-2">john.doe@example.com</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">College</td>
                                            <td className="border px-4 py-2">Depstar</td>
                                        </tr>
                                        <tr>
                                            <td className="border px-4 py-2">Department</td>
                                            <td className="border px-4 py-2">CSE</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {selectedOption === 'password' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-gray-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePopup;
