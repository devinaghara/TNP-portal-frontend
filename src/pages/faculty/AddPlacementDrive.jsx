import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddPlacementDrive = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [drives, setDrives] = useState([]);
  const [completedDrives, setCompletedDrives] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDrive, setCurrentDrive] = useState(null);
  const [noPlacedStudents, setNoPlacedStudents] = useState('');
  
  // Loading states
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [loadingCompletedDrives, setLoadingCompletedDrives] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch ongoing placement drives
  const fetchOngoingDrives = async () => {
    try {
      setLoadingDrives(true);
      const response = await axios.get('http://localhost:3003/placementdrive/placement/list?type=faculty', {
        withCredentials: true
      });
  
      // Use response.upcomingDrives instead of response.data.drives
      setDrives(Array.isArray(response.data.upcomingDrives) ? response.data.upcomingDrives : []);
      toast.success('Ongoing drives fetched successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch ongoing drives');
      setDrives([]);
    } finally {
      setLoadingDrives(false);
    }
  };

  // Fetch completed placement drives
  const fetchCompletedDrives = async () => {
    try {
      setLoadingCompletedDrives(true);
      const response = await axios.get('http://localhost:3003/placementdrive/placement/list?type=faculty', {
        withCredentials: true
      });
  
      // Change this line to use pastDrives
      setCompletedDrives(Array.isArray(response.data.pastDrives) ? response.data.pastDrives : []);
      toast.success('Completed drives fetched successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch completed drives');
      setCompletedDrives([]);
    } finally {
      setLoadingCompletedDrives(false);
    }
  };

  useEffect(() => {
    fetchOngoingDrives();
    fetchCompletedDrives();
  }, []);

  // Handle form submission for adding a placement drive
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    try {
      const newDrive = {
        companyName: event.target.companyName.value,
        date: event.target.date.value,
        noOfRounds: event.target.noOfRounds.value,
        roundDescription: event.target.roundDescription.value,
        techStack: event.target.techStack.value,
      };

      const response = await axios.post('http://localhost:3003/placementdrive/placement/add', newDrive, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Add the new drive to the list
      toast.success('Placement drive added successfully!');
      setDrives([...drives, response.data.drive]);
      event.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add placement drive');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle completing a placement drive
  const handlePopupSubmit = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);

    try {
      if (currentDrive && noPlacedStudents !== '') {
        const response = await axios.put(
          `http://localhost:3003/placementdrive/complete/${currentDrive._id}`,
          { noPlacedStudents },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Remove from ongoing drives and add to completed drives
        toast.success('Placement drive completed successfully!');
        setDrives(drives.filter((drive) => drive._id !== currentDrive._id));
        setCompletedDrives([...completedDrives, response.data.drive]);

        // Clear state and close popup
        setShowPopup(false);
        setCurrentDrive(null);
        setNoPlacedStudents('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete placement drive');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Placement Drives</h1>

      {/* Tabs for navigation */}
      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('add')}
        >
          Add Placement Drive
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('completed')}
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
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Adding Drive...
                </div>
              ) : (
                'Add Drive'
              )}
            </button>
          </form>

          {/* Table of Added Placement Drives */}
          <h3 className="text-xl font-semibold mb-4">Added Placement Drives</h3>
          {loadingDrives ? (
            <div className="text-center py-4">Loading drives...</div>
          ) : drives.length > 0 ? (
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
                        onClick={() => {
                          setCurrentDrive(drive);
                          setShowPopup(true);
                        }}
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
          {loadingCompletedDrives ? (
            <div className="text-center py-4">Loading completed drives...</div>
          ) : completedDrives.length > 0 ? (
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
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-4"
                onClick={() => setShowPopup(false)}
                disabled={submitLoading}
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