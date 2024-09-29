import React, { useEffect, useState } from 'react';

const ExamCenter = () => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        // Fetch the exam data from the backend (replace with your API endpoint)
        const fetchExams = async () => {
            try {
                // Replace this with the actual API call
                const response = await fetch('/api/exams');
                const data = await response.json();
                setExams(data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Exam Center</h1>
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
                                <td className="px-4 py-2 border-b border-gray-200">{exam.date}</td>
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
    );
};

export default ExamCenter;
