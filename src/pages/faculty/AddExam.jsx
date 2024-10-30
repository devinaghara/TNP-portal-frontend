import React, { useState } from 'react';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { CalendarDays, MapPin, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddExam = () => {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [exams, setExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentExam, setCurrentExam] = useState({});
  const [loading, setLoading] = useState(false);

  // Function to add exam to backend using axios
  const addExamToBackend = async (examData) => {
    try {
      const response = await axios.post('http://localhost:3003/exam/add', {
        examDate: examData.date,
        examTime: examData.time,
        examDuration: examData.duration,
        examDepartment: examData.departmentName,
        examCollage: examData.collegeName,
        examType: examData.examType,
        examStatus: 'scheduled',
        venue: examData.venue
      },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to add exam';
    }
  };

  // Handle form submission for adding or editing an exam
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const newExam = {
        examDate: event.target.date.value,
        examTime: event.target.time.value,
        examDuration: parseInt(event.target.duration.value),
        examDepartment: event.target.departmentName.value,
        examCollage: event.target.collegeName.value,
        examType: event.target.examType.value,
        examStatus: 'scheduled',
        venue: event.target.venue.value
      };

      // Add exam to backend
      const response = await axios.post('http://localhost:3003/exam/add', newExam, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Exam added successfully!');
        event.target.reset();
        setCurrentExam({});
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding exam:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add exam');
    } finally {
      setLoading(false);
    }
  };

  const markExamAsDone = (index) => {
    const examToComplete = exams[index];
    setCompletedExams([...completedExams, { ...examToComplete, done: true }]);
    const updatedExams = exams.filter((_, i) => i !== index);
    setExams(updatedExams);
  };

  const handleEditExam = (index) => {
    setCurrentExam(exams[index]);
    setEditingIndex(index);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add Exam</h1>

      {/* Tabs */}
      <div className="mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'scheduled' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled Exams
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
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
                  placeholder="e.g., aptitude, technical"
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
              disabled={loading}
            >
              {loading ? 'Saving...' : (editingIndex !== null ? 'Update Exam' : 'Add Exam')}
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
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleEditExam(index)}
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
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Completed Exams</h3>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {completedExams.length} Completed
            </span>
          </div>

          {completedExams.length > 0 ? (
            <div className="space-y-4">
              {completedExams.map((exam, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="text-lg font-medium text-gray-900">
                        {exam.examType}
                      </h4>
                    </div>
                    <span className="text-sm text-gray-500">
                      Duration: {exam.duration} min
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm">{formatDate(exam.date)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{exam.time}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{exam.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No completed exams yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddExam;