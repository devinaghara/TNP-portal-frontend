import { useEffect, useState } from 'react';
import axios from 'axios';
import StudentModal from '../../components/Faculty/StudentModal';

const StudentCorner = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState(''); // New state for filtering by student ID
  const [collegeFilter, setCollegeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10); // Number of students to display per page

  // Unique college and department options
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch student data from the server
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3003/master/all', { withCredentials: true });
        setStudents(response.data.student);
        setFilteredStudents(response.data.student); // Initially show all students

        // Extract unique colleges and departments
        const uniqueColleges = [...new Set(response.data.student.map(student => student.collageName))];
        const uniqueDepartments = [...new Set(response.data.student.map(student => student.departmentName))];

        setColleges(uniqueColleges);
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Function to filter students based on the filter values
  const filterStudents = () => {
    const filtered = students.filter(student => {
      return (
        student.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        student.studentId.toLowerCase().includes(idFilter.toLowerCase()) && // Filter by ID
        (collegeFilter ? student.collageName === collegeFilter : true) &&
        (departmentFilter ? student.departmentName === departmentFilter : true)
      );
    });
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Effect to run filtering on every filter change
  useEffect(() => {
    filterStudents();
  }, [nameFilter, idFilter, collegeFilter, departmentFilter, students]);

  // Calculate the current students to display based on the current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Pagination Controls
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="m-0 p-0">

      <div className="py-6 text-center">
        <h1 className="text-3xl font-bold">Student Corner</h1>
      </div>

      {/* Filter Inputs */}
      <div className="flex flex-wrap justify-around mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          placeholder="Search by ID" // New search field for student ID
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Colleges</option>
          {colleges.map((college, index) => (
            <option key={index} value={college}>
              {college}
            </option>
          ))}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Departments</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      {/* Student Table */}
      <div className="overflow-hidden px-4">
        <table className="min-w-full h-full table-auto bg-white shadow-md rounded-lg border border-gray-300">
          <thead>
            <tr className="uppercase bg-gray-200">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Student ID</th>
              <th className="py-2 px-4 border">College Name</th>
              <th className="py-2 px-4 border">CGPA</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Interested Domains</th>
              <th className="py-2 px-4 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student._id} className={`text-center ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-2 px-4 border">{student.name}</td>
                  <td className="py-2 px-4 border">{student.studentId}</td>
                  <td className="py-2 px-4 border">{student.collageName}</td>
                  <td className="py-2 px-4 border">{student.cgpa}</td>
                  <td className="py-2 px-4 border">{student.departmentName}</td>
                  <td className="py-2 px-4 border">{student.interestedDomain.join(', ')}</td>
                  <td className="py-2 px-4 border">
                    <button 
                      onClick={() => openModal(student)} 
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center my-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="flex items-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Modal for Student Details */}
      {isModalOpen && (
        <StudentModal student={selectedStudent} onClose={closeModal} />
      )}
    </div>
  );
};

export default StudentCorner;
