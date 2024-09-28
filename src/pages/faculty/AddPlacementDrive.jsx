import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const AddPlacementDrive = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [drives, setDrives] = useState([]);
  const [completedDrives, setCompletedDrives] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDrive, setCurrentDrive] = useState(null);
  const [noPlacedStudents, setNoPlacedStudents] = useState('');

  // Handle form submission for adding a placement drive
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newDrive = {
      companyName: event.target.companyName.value,
      date: event.target.date.value,
      noOfRounds: event.target.noOfRounds.value,
      roundDescription: event.target.roundDescription.value,
      techStack: event.target.techStack.value,
    };
    setDrives([...drives, newDrive]);
    event.target.reset();
  };

  // Handle tab switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Show the popup when the faculty clicks the check icon
  const handleShowPopup = (drive) => {
    setCurrentDrive(drive);
    setShowPopup(true);
  };

  // Handle form submission in popup and move the drive to completed
  const handlePopupSubmit = (event) => {
    event.preventDefault();

    if (currentDrive && noPlacedStudents !== '') {
      const completedDrive = {
        ...currentDrive,
        noPlacedStudents,
      };

      // Move the drive to the completed drives
      setCompletedDrives([...completedDrives, completedDrive]);

      // Remove the drive from the ongoing drives list
      setDrives(drives.filter((drive) => drive !== currentDrive));

      // Clear state and close the popup
      setShowPopup(false);
      setCurrentDrive(null);
      setNoPlacedStudents('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Placement Drives</h1>

      {/* Tabs for navigation */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
          onClick={() => handleTabChange('add')}
        >
          Add Placement Drive
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
          onClick={() => handleTabChange('completed')}
        >
          Completed Placement Drives
        </button>
      </div>

      {activeTab === 'add' ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Placement Drive</h2>

          {/* Placement Drive Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 mb-8 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="noOfRounds" className="block text-sm font-medium mb-1">
                  Number of Rounds
                </label>
                <input
                  type="number"
                  id="noOfRounds"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="techStack" className="block text-sm font-medium mb-1">
                  Technology Stack
                </label>
                <input
                  type="text"
                  id="techStack"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="roundDescription" className="block text-sm font-medium mb-1">
                Description of Rounds
              </label>
              <textarea
                id="roundDescription"
                className="w-full border border-gray-300 p-2 rounded-md"
                rows="3"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Drive
            </button>
          </form>

          {/* Table of Added Placement Drives */}
          <h3 className="text-xl font-semibold mb-4">Added Placement Drives</h3>
          {drives.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 text-left">Company Name</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Rounds</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Tech Stack</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((drive, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4">{drive.companyName}</td>
                    <td className="py-2 px-4">{drive.date}</td>
                    <td className="py-2 px-4">{drive.noOfRounds}</td>
                    <td className="py-2 px-4">{drive.roundDescription}</td>
                    <td className="py-2 px-4">{drive.techStack}</td>
                    <td className="py-2 px-4">
                      <FaCheckCircle
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleShowPopup(drive)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No placement drives added yet.</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Completed Placement Drives</h2>

          {/* Table of Completed Placement Drives */}
          {completedDrives.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 text-left">Company Name</th>
                  <th className="py-2 px-4 text-left">No. of Placed Students</th>
                  <th className="py-2 px-4 text-left">Tech Stack</th>
                </tr>
              </thead>
              <tbody>
                {completedDrives.map((drive, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4">{drive.companyName}</td>
                    <td className="py-2 px-4">{drive.noPlacedStudents}</td>
                    <td className="py-2 px-4">{drive.techStack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No completed placement drives yet.</p>
          )}
        </div>
      )}

      {/* Popup for number of placed students */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Enter Number of Placed Students for {currentDrive?.companyName}
            </h3>
            <form onSubmit={handlePopupSubmit}>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded-md mb-4"
                value={noPlacedStudents}
                onChange={(e) => setNoPlacedStudents(e.target.value)}
                min="1"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-4"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPlacementDrive;
