import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaUserTie, FaMapMarkerAlt } from 'react-icons/fa';

const Support = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Support & Contact</h1>
                    <p className="text-gray-500">We're here to help you with any questions or concerns</p>
                </div>

                <div className="grid gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaPhoneAlt className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Contact Number</h2>
                            <p className="text-gray-600">+91 94081 51969</p>
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all">
                        <div className="bg-red-100 p-3 rounded-full">
                            <FaEnvelope className="text-red-600 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Support Email</h2>
                            <p className="text-gray-600">tnp@charusat.ac.in</p>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaUserTie className="text-green-600 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Training and Placement Officer</h2>
                            <p className="text-gray-600">Ashwin Makwana</p>
                            <p className="text-sm text-gray-500">TPO - Career Development and Placement Cell (CDPC)</p>
                            <p className="text-gray-600">+91 94081 51969 / ashwinmakwana.ce@charusat.ac.in</p><br></br>
                            <p className="text-gray-600">Sujal Dadhaniya</p>
                            <p className="text-sm text-gray-500">TPO - Career Development and Placement Cell (CDPC)</p>
                            <p className="text-gray-600">+91 96622 55116 / tpo@charusat.ac.in</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaMapMarkerAlt className="text-purple-600 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                            <p className="text-gray-600">CHARUSAT Campus, Changa</p>
                            <p className="text-sm text-gray-500">Off. Nadiad-Petlad Highway, Gujarat, India</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">Working Hours: 9:10 AM - 4:20 PM (Mon-Fri)</p>
                </div>
            </div>
        </div>
    );
};

export default Support;