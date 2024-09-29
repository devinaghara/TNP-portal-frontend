import React, { useState } from 'react';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';

const AddExam = () => {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [exams, setExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentExam, setCurrentExam] = useState({});

  // Handle form submission for adding or editing an exam
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const newExam = {
      date: event.target.date.value,
      time: event.target.time.value,
      examType: event.target.examType.value,
      venue: event.target.venue.value,
      collegeName: event.target.collegeName.value,
      departmentName: event.target.departmentName.value,
      duration: event.target.duration.value,
      done: false,
    };

    if (editingIndex !== null) {
      // Update existing exam
      const updatedExams = [...exams];
      updatedExams[editingIndex] = newExam;
      setExams(updatedExams);
      setEditingIndex(null); // Reset editing index
    } else {
      // Add new exam
      setExams([...exams, newExam]);
    }

    event.target.reset();
    setCurrentExam({}); // Reset current exam
  };

  // Handle marking exam as done
  const markExamAsDone = (index) => {
    const examToComplete = exams[index];
    setCompletedExams([...completedExams, { ...examToComplete, done: true }]);

    const updatedExams = exams.filter((_, i) => i !== index);
    setExams(updatedExams);
  };

  // Handle edit exam
  const handleEditExam = (index) => {
    setCurrentExam(exams[index]);
    setEditingIndex(index);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add Exam</h1>

      {/* Tabs for Scheduled and Completed Exams */}
      <div className="mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'scheduled' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled Exams
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Exams
        </button>
      </div>

      {activeTab === 'scheduled' && (
        <div>
          {/* Add/Edit Exam Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                  defaultValue={currentExam.date}
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  id="time"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                  defaultValue={currentExam.time}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="examType" className="block text-sm font-medium mb-1">Exam Type</label>
                <input
                  type="text"
                  id="examType"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="e.g., Final, Midterm"
                  required
                  defaultValue={currentExam.examType}
                />
              </div>
              <div>
                <label htmlFor="venue" className="block text-sm font-medium mb-1">Venue</label>
                <input
                  type="text"
                  id="venue"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="e.g., Room 101"
                  required
                  defaultValue={currentExam.venue}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="collegeName" className="block text-sm font-medium mb-1">College Name</label>
                <select
                  id="collegeName"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                  defaultValue={currentExam.collegeName}
                >
                  <option value="">Select College</option>
                  <option value="DEPSTAR">DEPSTAR</option>
                  <option value="CSPIT">CSPIT</option>
                </select>
              </div>
              <div>
                <label htmlFor="departmentName" className="block text-sm font-medium mb-1">Department Name</label>
                <select
                  id="departmentName"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                  defaultValue={currentExam.departmentName}
                >
                  <option value="">Select Department</option>
                  <option value="CE">CE</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="e.g., 120"
                required
                defaultValue={currentExam.duration}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {editingIndex !== null ? 'Update Exam' : 'Add Exam'}
            </button>
          </form>

          {/* Scheduled Exams Table */}
          <h3 className="text-xl font-semibold mb-4">Scheduled Exams</h3>
          {exams.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Exam Type</th>
                  <th className="py-2 px-4 text-left">Venue</th>
                  <th className="py-2 px-4 text-left">College</th>
                  <th className="py-2 px-4 text-left">Department</th>
                  <th className="py-2 px-4 text-left">Duration</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4">{exam.date}</td>
                    <td className="py-2 px-4">{exam.time}</td>
                    <td className="py-2 px-4">{exam.examType}</td>
                    <td className="py-2 px-4">{exam.venue}</td>
                    <td className="py-2 px-4">{exam.collegeName}</td>
                    <td className="py-2 px-4">{exam.departmentName}</td>
                    <td className="py-2 px-4">{exam.duration} min</td>
                    <td className="py-2 px-4 flex items-center space-x-2">
                      <FaCheckCircle
                        className="text-green-500 cursor-pointer"
                        onClick={() => markExamAsDone(index)}
                      />
                      <FaEdit
                        className={`text-blue-500 cursor-pointer ${exam.done ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleEditExam(index)}
                        title={exam.done ? 'Cannot edit completed exam' : ''}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No exams scheduled yet.</p>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Completed Exams</h3>
          {completedExams.length > 0 ? (
            <ul className="list-disc pl-6">
              {completedExams.map((exam, index) => (
                <li key={index}>
                  {exam.date} - {exam.examType} at {exam.venue} (Duration: {exam.duration} min)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No completed exams yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddExam;
