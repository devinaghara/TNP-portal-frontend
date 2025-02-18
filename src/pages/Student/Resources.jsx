import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('http://localhost:3003/resource/all',{
                    withCredentials:true,
                });
                setResources(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse text-xl text-gray-500">
                    Loading resources...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-red-50">
                <div className="text-red-600 text-xl font-semibold p-6 bg-white rounded-lg shadow-md">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 stretch-w-full">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                        Academic Resources
                    </h1>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {['Subject', 'Drive Link', 'Uploaded By'].map((header) => (
                                    <th 
                                        key={header} 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {resources.map((resource) => (
                                <tr 
                                    key={resource._id} 
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {resource.subject}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a 
                                            href={resource.driveLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-150"
                                        >
                                            Open Link
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {resource.uploadedBy.name} 
                                        <span className="text-xs text-gray-400 ml-2">
                                            ({resource.uploadedBy.email})
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {resources.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No resources available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resources;