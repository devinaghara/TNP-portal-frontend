import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import StudentModal from '../../components/Faculty/StudentModal';
import debounce from 'lodash/debounce';

const StudentCorner = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [passoutBatchFilter, setPassoutBatchFilter] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  // Filter options
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [passoutBatches, setPassoutBatches] = useState([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDownload = async (format) => {
    try {
      const filters = {
        name: nameFilter,
        studentId: idFilter,
        collageName: collegeFilter,
        departmentName: departmentFilter,
        passoutBatch: passoutBatchFilter
      };

      const response = await axios.get(
        `http://localhost:3003/master/download`,
        {
          params: {
            ...filters,
            format: format
          },
          responseType: 'blob',
          withCredentials: true
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: format === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `students-list.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.download-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchStudents = async (filters) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3003/master/all`,
        {
          params: {
            page: currentPage,
            limit: studentsPerPage,
            name: filters.name,
            studentId: filters.studentId,
            collageName: filters.collageName,
            departmentName: filters.departmentName,
            passoutBatch: filters.passoutBatch
          },
          withCredentials: true
        }
      );

      setStudents(response.data.student);
      setTotalPages(response.data.totalPages);
      setTotalStudents(response.data.totalStudents);
      setColleges(response.data.colleges);
      setDepartments(response.data.departments);
      setPassoutBatches(response.data.passoutBatches);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce((filters) => {
      fetchStudents(filters);
    }, 500),
    []
  );

  // Effect to handle filters
  useEffect(() => {
    const filters = {
      name: nameFilter,
      studentId: idFilter,
      collageName: collegeFilter,
      departmentName: departmentFilter,
      passoutBatch: passoutBatchFilter
    };
    debouncedFetch(filters);

    return () => {
      debouncedFetch.cancel();
    };
  }, [nameFilter, idFilter, collegeFilter, departmentFilter, passoutBatchFilter, currentPage, studentsPerPage]);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
          placeholder="Search by ID"
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
        <select
          value={passoutBatchFilter}
          onChange={(e) => setPassoutBatchFilter(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">All Passout Batches</option>
          {passoutBatches.map((batch, index) => (
            <option key={index} value={batch}>
              {batch}
            </option>
          ))}
        </select>

        {/* Download Button with Dropdown */}
        <div className="relative download-dropdown">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {/* Download Icon */}
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => handleDownload('pdf')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {/* PDF Icon */}
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Download as PDF
                </button>
                <button
                  onClick={() => handleDownload('excel')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  {/* Excel Icon */}
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Download as Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
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
                {students.length > 0 ? (
                  students.map((student, index) => (
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
          <div className="flex justify-center items-center gap-4 my-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span>Page {currentPage} of {totalPages}</span>
              <span className="text-gray-500">({totalStudents} total students)</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal for Student Details */}
      {isModalOpen && (
        <StudentModal student={selectedStudent} onClose={closeModal} />
      )}
    </div>
  );
};

export default StudentCorner;