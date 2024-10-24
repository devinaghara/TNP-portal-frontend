import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentSignUpPage = () => {
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [otherDomain, setOtherDomain] = useState('');
  const [sgpaFields, setSgpaFields] = useState([1]); // Start with one field

  const navigate = useNavigate();
  const { state } = useLocation();

  const handleDomainChange = (event) => {
    const { value, checked } = event.target;
    setSelectedDomains((prevSelectedDomains) =>
      checked
        ? [...prevSelectedDomains, value]
        : prevSelectedDomains.filter((domain) => domain !== value)
    );
  };

  const addSemesterField = () => {
    if (sgpaFields.length < 8) {
      setSgpaFields([...sgpaFields, sgpaFields.length + 1]);
    }
  };

  const email = state?.email || '';
  const role = state?.role || '';

  useEffect(() => {
    // If no email or role, or if role is not 'student', redirect to signup page
    console.log(role);
    if (!email || !role || role !== 'Student') {
      navigate('/signup');
    }
  }, [email, role, navigate]); // Make sure to include dependencies

  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentData = {
      studentId: event.target.idNumber.value,
      name: event.target.name.value,
      collageName: event.target.collegeName.value,
      departmentName: event.target.deptName.value,
      mobileNumber: event.target.mobileNumber.value,
      sscResult: event.target.sscResult.value,
      hscResult: event.target.hscResult.value,
      diplomaResult: event.target.diplomaResult.value || null,
      cgpa: event.target.cgpa.value,
      sgpa: sgpaFields.reduce((acc, _, index) => {
        acc[`sgpa${index + 1}`] = event.target[`sgpa${index}`].value;
        return acc;
      }, {}),
      noOfBacklog: event.target.backlogs.value,
      interestedDomain: [...selectedDomains, otherDomain].filter(Boolean),
      email: email,
    };

    try {
      console.log(studentData)
      const response = await axios.post('http://localhost:3003/auth/add/student', studentData,{
        withCredentials:true
      });
      console.log(response.data); // Handle success (e.g., redirect or show a success message)
      navigate('/'); // Redirect to success page (adjust as needed)
    } catch (error) {
      console.error(error); // Handle error (e.g., show an error message)
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://res.cloudinary.com/ddxe0b0kf/image/upload/v1723373873/ps538j7lnfoqyb9uolyo.jpg)',
      }}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Student Details</h1>
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            {/* Name and ID Number Fields */}
            <div className="flex mb-6 space-x-4">
              <div className="w-1/2">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="idNumber" className="block text-gray-700 mb-2">
                  ID No.
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
                readOnly
              />
            </div>

            {/* College Name Dropdown */}
            <div className="mb-6">
              <label htmlFor="collegeName" className="block text-gray-700 mb-2">
                College Name
              </label>
              <select
                id="collegeName"
                name="collegeName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select College</option>
                <option value="Depstar">Depstar</option>
                <option value="CSPIT">CSPIT</option>
              </select>
            </div>

            {/* Dept. Name Dropdown */}
            <div className="mb-6">
              <label htmlFor="deptName" className="block text-gray-700 mb-2">
                Dept. Name
              </label>
              <select
                id="deptName"
                name="deptName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
              </select>
            </div>

            {/* Other Fields */}
            <div className="mb-6">
              <label htmlFor="mobileNumber" className="block text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="sscResult" className="block text-gray-700 mb-2">
                SSC Result
              </label>
              <input
                type="text"
                id="sscResult"
                name="sscResult"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="hscResult" className="block text-gray-700 mb-2">
                HSC Result
              </label>
              <input
                type="text"
                id="hscResult"
                name="hscResult"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="diplomaResult" className="block text-gray-700 mb-2">
                Diploma Result
              </label>
              <input
                type="text"
                id="diplomaResult"
                name="diplomaResult"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="cgpa" className="block text-gray-700 mb-2">
                CGPA
              </label>
              <input
                type="text"
                id="cgpa"
                name="cgpa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">SGPA (All Semesters)</label>
              <div className="flex flex-wrap space-x-4">
                {sgpaFields.map((_, index) => (
                  <div className="flex flex-col mb-4" key={index}>
                    <label htmlFor={`sgpa${index}`} className="block text-gray-700 mb-2">
                      SGPA {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`sgpa${index}`}
                      name={`sgpa${index}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 text-blue-500"
                onClick={addSemesterField}
              >
                Add Semester
              </button>
            </div>

            {/* Backlogs */}
            <div className="mb-6">
              <label htmlFor="backlogs" className="block text-gray-700 mb-2">
                No. of Backlogs
              </label>
              <input
                type="text"
                id="backlogs"
                name="backlogs"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Interested Domains */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Interested Domains</label>
              <div className="flex flex-wrap space-x-4">
                {['Web Development', 'Machine Learning', 'Data Science', 'Other'].map((domain) => (
                  <label key={domain} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={domain}
                      checked={selectedDomains.includes(domain)}
                      onChange={handleDomainChange}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">{domain}</span>
                  </label>
                ))}
              </div>
              {selectedDomains.includes('Other') && (
                <input
                  type="text"
                  value={otherDomain}
                  onChange={(e) => setOtherDomain(e.target.value)}
                  placeholder="Specify Other Domain"
                  className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUpPage;
