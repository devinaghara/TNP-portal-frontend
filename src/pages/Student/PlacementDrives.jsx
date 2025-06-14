import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Info } from 'lucide-react';
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
            
            const upcomingResponse = await axios.get('http://localhost:3003/placementdrive/placement/list', {
                withCredentials: true,
                params: { status: 'upcoming' }
            });

            const pastResponse = await axios.get('http://localhost:3003/placementdrive/placement/list', {
                withCredentials: true,
                params: { status: 'completed' }
            });

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

    const InfoTooltip = ({ description }) => (
        <div className="group relative inline-block ml-2">
            <Info className="w-4 h-4 text-gray-500 cursor-help" />
            <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg -left-28 top-full">
                <div className="absolute w-3 h-3 -mt-5 rotate-45 bg-gray-800 left-1/2 -ml-1.5"></div>
                {description}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Placement Drives</h1>
                    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

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
                                        <td className="px-4 py-2 border-b border-gray-200">
                                            {drive.noOfRounds}
                                            <InfoTooltip description={drive.roundDescription} />
                                        </td>
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