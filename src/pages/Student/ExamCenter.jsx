import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaBookOpen, FaMapMarkerAlt, FaHourglassHalf, FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';
import { BiTask } from 'react-icons/bi';

const ExamCenter = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3003/exam/show?type=student', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // console.log('Raw response:', response.data);

            if (!response.data) {
                throw new Error('No data received from server');
            }

            const examData = Array.isArray(response.data.exams) ? response.data.exams : [response.data.exams];

            if (examData.length === 0) {
                console.log('No exams found in the response');
            }

            const transformedExams = examData.map(exam => {
                // console.log('Processing exam:', exam);
                return {
                    id: exam?._id || '',
                    date: exam?.examDate || '',
                    time: exam?.examTime || '',
                    type: exam?.examType || '',
                    venue: exam?.venue || '',
                    duration: exam?.examDuration || '',
                    status: exam?.examStatus || 'pending',
                    department: exam?.examDepartment || '',
                    college: exam?.examCollage || ''
                };
            });

            console.log('Transformed exams:', transformedExams);
            setExams(transformedExams);
            setError(null);
        } catch (error) {
            console.error('Error fetching exams:', error);
            
            let errorMessage = 'Failed to load exams. Please try again later.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
            } else if (error.response?.status === 404) {
                errorMessage = 'No exams found for your department.';
            } else if (!error.response && error.message === 'Network Error') {
                errorMessage = 'Unable to connect to the server. Please check your connection.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Center</h1>
                    <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Center</h1>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-4 bg-red-100 text-red-700 p-4 rounded-lg">
                            <FaExclamationTriangle className="h-5 w-5 mr-2" />
                            <p className="font-medium">{error}</p>
                        </div>
                        <button
                            onClick={fetchExams}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                            <FaSyncAlt className="h-4 w-4" />
                            <span>Retry</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Exam Center</h1>
                    <button
                        onClick={fetchExams}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                        <FaSyncAlt className="h-4 w-4" />
                        <span>Refresh</span>
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaCalendarAlt className="h-4 w-4" />
                                            <span>Date</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaClock className="h-4 w-4" />
                                            <span>Time</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaBookOpen className="h-4 w-4" />
                                            <span>Exam Type</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaMapMarkerAlt className="h-4 w-4" />
                                            <span>Venue</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <FaHourglassHalf className="h-4 w-4" />
                                            <span>Duration</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center space-x-2">
                                            <BiTask className="h-4 w-4" />
                                            <span>Status</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {exams.length > 0 ? (
                                    exams.map((exam, index) => (
                                        <tr key={exam.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {exam.date ? new Date(exam.date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {exam.time || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {exam.type || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {exam.venue || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {exam.duration ? `${exam.duration} mins` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium
                                                    ${exam.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                    exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {exam.status || 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <FaBookOpen className="h-8 w-8 text-gray-400" />
                                                <p className="text-gray-500 text-lg">No exams scheduled.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamCenter;