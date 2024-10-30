import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExamCenter = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:3003';
    axios.defaults.withCredentials = true; // Enable sending credentials/cookies

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/exam/student/show', {
                headers: {
                    'Content-Type': 'application/json',
                    // If you're using token-based auth, uncomment and modify the following line
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Transform the backend data structure to match the component's structure
            const transformedExams = response.data.map(exam => ({
                date: exam.examDate,
                time: exam.examTime,
                type: exam.examType,
                venue: exam.venue
            }));

            setExams(transformedExams);
            setError(null);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setError(error.response?.data?.message || 'Failed to load exams. Please try again later.');
            
            // Handle unauthorized error
            if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
                // Optionally redirect to login
                // window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Exam Center</h1>
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Exam Center</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Exam Center</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                Date
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                Time
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                Exam Type
                            </th>
                            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                Venue
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.length > 0 ? (
                            exams.map((exam, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border-b border-gray-200">
                                        {new Date(exam.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-200">{exam.time}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{exam.type}</td>
                                    <td className="px-4 py-2 border-b border-gray-200">{exam.venue}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center px-4 py-2 border-b border-gray-200">
                                    No exams scheduled.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExamCenter;