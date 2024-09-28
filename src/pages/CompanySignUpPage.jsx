import React, { useState } from 'react';

const CompanySignUpPage = () => {
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [otherDomain, setOtherDomain] = useState('');

    const handleDomainChange = (event) => {
        const { value, checked } = event.target;

        if (value === 'Other') {
            setOtherDomain(''); // Reset other domain input if "Other" is unchecked
        }

        if (checked) {
            setSelectedDomains([...selectedDomains, value]);
        } else {
            setSelectedDomains(selectedDomains.filter(domain => domain !== value));
        }
    };

    const handleOtherDomainChange = (event) => {
        setOtherDomain(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Form submission logic
        console.log('Selected Domains:', selectedDomains);
        if (selectedDomains.includes('Other')) {
            console.log('Other Domain:', otherDomain);
        }
    };

    return (
        <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://res.cloudinary.com/ddxe0b0kf/image/upload/v1723373873/ps538j7lnfoqyb9uolyo.jpg)' }}>
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Company Details</h1>
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="companyName" className="block text-gray-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="hrName" className="block text-gray-700 mb-2">HR Name</label>
                            <input
                                type="text"
                                id="hrName"
                                name="hrName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="companyEmail" className="block text-gray-700 mb-2">Company Email</label>
                            <input
                                type="email"
                                id="companyEmail"
                                name="companyEmail"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="hrEmail" className="block text-gray-700 mb-2">HR Email</label>
                            <input
                                type="email"
                                id="hrEmail"
                                name="hrEmail"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="contactNumber" className="block text-gray-700 mb-2">Contact Number</label>
                            <input
                                type="text"
                                id="contactNumber"
                                name="contactNumber"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Working Domain</label>
                            <div className="space-y-2">
                                {['Web Development', 'Android Development', 'Data Science', 'AI/ML', 'Cloud Computing', 'Cyber Security', 'QA Testing', 'IoT', 'Other'].map(domain => (
                                    <div key={domain} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={domain}
                                            value={domain}
                                            className="mr-2"
                                            onChange={handleDomainChange}
                                        />
                                        <label htmlFor={domain} className="text-gray-700">{domain}</label>
                                    </div>
                                ))}
                            </div>
                            {selectedDomains.includes('Other') && (
                                <div className="mt-4">
                                    <label htmlFor="otherDomain" className="block text-gray-700 mb-2">Please Specify</label>
                                    <input
                                        type="text"
                                        id="otherDomain"
                                        name="otherDomain"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={otherDomain}
                                        onChange={handleOtherDomainChange}
                                        required
                                    />
                                </div>
                            )}
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

export default CompanySignUpPage;
