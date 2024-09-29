import React, { useEffect, useState } from 'react';

const PlacementDrives = () => {
    const [upcomingDrives, setUpcomingDrives] = useState([]);
    const [pastDrives, setPastDrives] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // State to manage active tab

    useEffect(() => {
        // Fetch the placement drives data from the backend (replace with your API endpoint)
        const fetchPlacementDrives = async () => {
            try {
                // Replace these with the actual API calls
                const upcomingResponse = await fetch('/api/placement-drives/upcoming');
                const pastResponse = await fetch('/api/placement-drives/past');

                const upcomingData = await upcomingResponse.json();
                const pastData = await pastResponse.json();

                setUpcomingDrives(upcomingData);
                setPastDrives(pastData);
            } catch (error) {
                console.error('Error fetching placement drives:', error);
            }
        };

        fetchPlacementDrives();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Placement Drives</h1>

            {/* Tabs */}
            <div className="mb-6">
                <button
                    className={`px-4 py-2 mr-4 ${activeTab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming Drives
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.date}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.companyName}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.rounds}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.technologyStack}</td>
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
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.placedStudents}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{drive.technologyStack}</td>
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
