import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaUserTie } from 'react-icons/fa';

const Support = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Support</h1>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <FaPhoneAlt className="text-blue-500" />
                    <div>
                        <h2 className="text-xl font-semibold">Contact Number</h2>
                        <p>+91 98765 43210</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-red-500" />
                    <div>
                        <h2 className="text-xl font-semibold">Support Email</h2>
                        <p>support@charusat.edu.in</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <FaUserTie className="text-green-500" />
                    <div>
                        <h2 className="text-xl font-semibold">Coordinator Contact</h2>
                        <p>Dr. John Doe</p>
                        <p>Coordinator, Training and Placement Cell</p>
                        <p>+91 98765 43211</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
