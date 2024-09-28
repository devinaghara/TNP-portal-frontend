import React from 'react';

const   FacultySignUpPage = () => {
    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://res.cloudinary.com/ddxe0b0kf/image/upload/v1723373873/ps538j7lnfoqyb9uolyo.jpg)' }}>
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Faculty Details</h1>
                    <form className="flex flex-col space-y-4">
                        <div className="mb-6">
                            <label htmlFor="facultyName" className="block text-gray-700 mb-2">Faculty Name</label>
                            <input
                                type="text"
                                id="facultyName"
                                name="facultyName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="facultyId" className="block text-gray-700 mb-2">Faculty ID No.</label>
                            <input
                                type="text"
                                id="facultyId"
                                name="facultyId"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="facultyEmail" className="block text-gray-700 mb-2">Faculty Email ID</label>
                            <input
                                type="email"
                                id="facultyEmail"
                                name="facultyEmail"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="collegeName" className="block text-gray-700 mb-2">College Name</label>
                            <input
                                type="text"
                                id="collegeName"
                                name="collegeName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="deptName" className="block text-gray-700 mb-2">Dept. Name</label>
                            <input
                                type="text"
                                id="deptName"
                                name="deptName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="mobileNumber" className="block text-gray-700 mb-2">Mobile Number</label>
                            <input
                                type="text"
                                id="mobileNumber"
                                name="mobileNumber"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="linkedinProfile" className="block text-gray-700 mb-2">LinkedIn Profile</label>
                            <input
                                type="url"
                                id="linkedinProfile"
                                name="linkedinProfile"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit Details
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacultySignUpPage;
