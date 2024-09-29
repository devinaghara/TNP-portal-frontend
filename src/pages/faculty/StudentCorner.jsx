import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentCorner = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    // Fetch student data from the server
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3003/students', { withCredentials: true });
        setStudents(response.data);
        setFilteredStudents(response.data); // Initially show all students
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by batch, college, department, and search query
  const handleFilters = () => {
    let filtered = students;

    if (selectedBatch) {
      filtered = filtered.filter((student) => student.batch === selectedBatch);
    }

    if (selectedCollege) {
      filtered = filtered.filter((student) => student.college === selectedCollege);
    }

    if (selectedDepartment) {
      filtered = filtered.filter((student) => student.department === selectedDepartment);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  // Apply filters whenever search, batch, college, or department change
  useEffect(() => {
    handleFilters();
  }, [selectedBatch, searchQuery, selectedCollege, selectedDepartment]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Corner</h1>

      {/* Search and Filters */}
      <div className="flex flex-wrap mb-4 space-x-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Batch Filter */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="p-2 border rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Batches</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>

        {/* College Filter */}
        <select
          value={selectedCollege}
          onChange={(e) => setSelectedCollege(e.target.value)}
          className="p-2 border rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Colleges</option>
          <option value="College A">College A</option>
          <option value="College B">College B</option>
          <option value="College C">College C</option>
        </select>

        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="p-2 border rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
        </select>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Mobile No.</th>
              <th className="py-2 px-4">SSC Result</th>
              <th className="py-2 px-4">HSC Result</th>
              <th className="py-2 px-4">CGPA</th>
              <th className="py-2 px-4">SGPA (Sem 1-8)</th>
              <th className="py-2 px-4">Backlogs</th>
              <th className="py-2 px-4">Interested Domains</th>
              <th className="py-2 px-4">Resume</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.id} className="text-center text-gray-700">
                  <td className="py-2 px-4 border">{index + 1}</td>
                  <td className="py-2 px-4 border">{student.name}</td>
                  <td className="py-2 px-4 border">{student.email}</td>
                  <td className="py-2 px-4 border">{student.mobileNumber}</td>
                  <td className="py-2 px-4 border">{student.sscResult}</td>
                  <td className="py-2 px-4 border">{student.hscResult}</td>
                  <td className="py-2 px-4 border">{student.cgpa}</td>
                  <td className="py-2 px-4 border">
                    {Object.keys(student.sgpa).map((semester) => (
                      <div key={semester}>
                        {semester}: {student.sgpa[semester]}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border">{student.noOfBacklog}</td>
                  <td className="py-2 px-4 border">
                    {student.interestedDomain.join(', ')}
                  </td>
                  <td className="py-2 px-4 border">
                    {student.resume ? (
                      <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View Resume
                      </a>
                    ) : (
                      'No Resume Uploaded'
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No students found for this batch/college/department.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentCorner;
