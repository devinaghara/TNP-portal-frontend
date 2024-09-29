/* eslint-disable react/prop-types */

const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Details</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="border border-gray-300 p-4 rounded-lg shadow transition duration-300 hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Basic Information</h3>
            <p className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span className="text-gray-900">{student.name}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">ID No:</span>
              <span className="text-gray-900">{student.studentId}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span className="text-gray-900">{student.email}</span>
            </p>
          </div>

          <div className="border border-gray-300 p-4 rounded-lg shadow transition duration-300 hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Academic Details</h3>
            <p className="flex justify-between">
              <span className="font-medium">College:</span>
              <span className="text-gray-900">{student.collageName}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Department:</span>
              <span className="text-gray-900">{student.departmentName}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">CGPA:</span>
              <span className="text-gray-900">{student.cgpa}</span>
            </p>
          </div>

          <div className="border border-gray-300 p-4 rounded-lg shadow transition duration-300 hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Results</h3>
            <p className="flex justify-between">
              <span className="font-medium">SSC Result:</span>
              <span className="text-gray-900">{student.sscResult}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">HSC Result:</span>
              <span className="text-gray-900">{student.hscResult}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Backlogs:</span>
              <span className="text-gray-900">{student.noOfBacklog}</span>
            </p>
          </div>

          <div className="border border-gray-300 p-4 rounded-lg shadow transition duration-300 hover:shadow-xl">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">SGPA</h3>
            {Object.entries(student.sgpa).map(([sem, value]) => (
              <p key={sem} className="flex justify-between">
                <span className="font-medium">{sem.replace('sgpa', 'Sem ')}:</span>
                <span className="text-gray-900">{value}</span>
              </p>
            ))}
          </div>

          <div className="border border-gray-300 p-4 rounded-lg shadow transition duration-300 hover:shadow-xl col-span-2">
            <h3 className="font-semibold text-lg text-gray-700 mb-2">Resume</h3>
            {student.resume ? (
              <p className="flex justify-between">
                <span className="font-medium">Resume:</span>
                <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Resume
                </a>
              </p>
            ) : (
              <p className="flex justify-between">
                <span className="font-medium">Resume:</span>
                <span className="text-gray-900">No Resume Uploaded</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button 
            onClick={onClose} 
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
