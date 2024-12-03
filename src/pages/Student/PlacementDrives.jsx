import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PlacementDrives = () => {
    const [upcomingDrives, setUpcomingDrives] = useState([]);
    const [pastDrives, setPastDrives] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlacementDrives = async () => {
        try {
            setLoading(true);
            
            // Fetch upcoming drives
            const upcomingResponse = await axios.get('http://localhost:3003/placementdrive/placement/list', {
                withCredentials: true,
                params: { status: 'upcoming' }
            });

            // Fetch past drives
            const pastResponse = await axios.get('http://localhost:3003/placementdrive/placement/list', {
                withCredentials: true,
                params: { status: 'completed' }
            });

            // Validate and set drives
            setUpcomingDrives(
                Array.isArray(upcomingResponse.data.upcomingDrives) 
                    ? upcomingResponse.data.upcomingDrives 
                    : []
            );
            
            setPastDrives(
                Array.isArray(pastResponse.data.pastDrives) 
                    ? pastResponse.data.pastDrives 
                    : []
            );
            
            toast.success('Placement drives fetched successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch placement drives');
            setError('Unable to fetch placement drives');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlacementDrives();
    }, []);

    // Render loading state
    if (loading) {
        return (
            <div className="p-8 text-center">
                <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto" />
                <p className="mt-4">Loading placement drives...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-8 text-red-600">
                <h1 className="text-3xl font-bold mb-4">Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Placement Drives</h1>

            {/* Tabs */}
            <div className="mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming Drives
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'past' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past Drives
                </button>
            </div>

            {/* Upcoming Placement Drives */}
            {activeTab === 'upcoming' && (
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Upcoming Placement Drives</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    Date
                                </th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    Company Name
                                </th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    No. of Rounds
                                </th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    Technology Stack
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingDrives.length > 0 ? (
                                upcomingDrives.map((drive, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border-b border-gray-200">
                                            {new Date(drive.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.companyName}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.noOfRounds}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.techStack}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center px-4 py-2 border-b border-gray-200">
                                        No upcoming placement drives scheduled.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Past Placement Drives */}
            {activeTab === 'past' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Past Placement Drives</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    Company Name
                                </th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    No. of Placed Students
                                </th>
                                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                    Technology Stack
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastDrives.length > 0 ? (
                                pastDrives.map((drive, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.companyName}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.noPlacedStudents || 0}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.techStack}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center px-4 py-2 border-b border-gray-200">
                                        No past placement drives available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PlacementDrives;