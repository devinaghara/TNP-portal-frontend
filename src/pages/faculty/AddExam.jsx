import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaEdit, FaSpinner } from 'react-icons/fa';
import { CalendarDays, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddExam = () => {
  const [activeTab, setActiveTab] = useState('scheduled');
  const [exams, setExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});
  const [formData, setFormData] = useState({
    examDate: '',
    examTime: '',
    examDuration: '',
    examDepartment: '',
    examCollage: '',
    examType: '',
    venue: ''
  });

  const resetForm = () => {
    setFormData({
      examDate: '',
      examTime: '',
      examDuration: '',
      examDepartment: '',
      examCollage: '',
      examType: '',
      venue: ''
    });
    setEditingIndex(null);
  };

  const fetchExams = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get('http://localhost:3003/exam/show?type=faculty', {
        withCredentials: true,
      });

      if (response.data.success) {
        const scheduledExams = response.data.exams.filter(exam => exam.examStatus === 'scheduled');
        const completed = response.data.exams.filter(exam => exam.examStatus === 'completed');
        setExams(scheduledExams);
        setCompletedExams(completed);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch exams');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingIndex) {
        const response = await axios.put(
          `http://localhost:3003/exam/edit/${editingIndex}`,
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          toast.success('Exam updated successfully!');
          resetForm();
          await fetchExams();
        }
      } else {
        const response = await axios.post(
          'http://localhost:3003/exam/add',
          { ...formData, examStatus: 'scheduled' },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          toast.success('Exam added successfully!');
          resetForm();
          await fetchExams();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExam = (exam) => {
    setFormData({
      examDate: exam.examDate?.split('T')[0] || '',
      examTime: exam.examTime || '',
      examDuration: exam.examDuration || '',
      examDepartment: exam.examDepartment || '',
      examCollage: exam.examCollage || '',
      examType: exam.examType || '',
      venue: exam.venue || ''
    });
    setEditingIndex(exam._id);
  };

  const updateExamStatus = async (examId, newStatus) => {
    setStatusUpdateLoading(prev => ({ ...prev, [examId]: true }));
    try {
      const response = await axios.put(
        `http://localhost:3003/exam/updateStatus/${examId}`,
        { examStatus: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Exam marked as ${newStatus}!`);
        await fetchExams();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update exam status');
    } finally {
      setStatusUpdateLoading(prev => ({ ...prev, [examId]: false }));
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'scheduled':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const StatusActions = ({ exam }) => {
    if (statusUpdateLoading[exam._id]) {
      return <FaSpinner className="animate-spin text-gray-500" />;
    }

    switch (exam.examStatus) {
      case 'scheduled':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => updateExamStatus(exam._id, 'completed')}
              className="text-green-500 hover:text-green-600"
              title="Mark as completed"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEditExam(exam)}
              className="text-blue-500 hover:text-blue-600"
              title="Edit exam"
            >
              <FaEdit className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Exam Management</h1>

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
          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="examDate" className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  id="examDate"
                  value={formData.examDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="examTime" className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  id="examTime"
                  value={formData.examTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="examType" className="block text-sm font-medium mb-1">Exam Type</label>
                <input
                  type="text"
                  id="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="e.g., aptitude, technical"
                  required
                />
              </div>
              <div>
                <label htmlFor="venue" className="block text-sm font-medium mb-1">Venue</label>
                <input
                  type="text"
                  id="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  placeholder="e.g., Room 101"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="examCollage" className="block text-sm font-medium mb-1">College Name</label>
                <select
                  id="examCollage"
                  value={formData.examCollage}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="">Select College</option>
                  <option value="DEPSTAR">DEPSTAR</option>
                  <option value="CSPIT">CSPIT</option>
                </select>
              </div>
              <div>
                <label htmlFor="examDepartment" className="block text-sm font-medium mb-1">Department Name</label>
                <select
                  id="examDepartment"
                  value={formData.examDepartment}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="CE">CE</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="examDuration" className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                id="examDuration"
                value={formData.examDuration}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="e.g., 120"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingIndex ? 'Update Exam' : 'Add Exam')}
              </button>
              {editingIndex && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Scheduled Exams Table */}
          <h3 className="text-xl font-semibold mb-4">Scheduled Exams</h3>
          {fetchLoading ? (
            <div className="text-center py-4">Loading exams...</div>
          ) : exams.length > 0 ? (
            <div className="overflow-x-auto">
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
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-2 px-4">{formatDate(exam.examDate)}</td>
                      <td className="py-2 px-4">{exam.examTime}</td>
                      <td className="py-2 px-4">{exam.examType}</td>
                      <td className="py-2 px-4">{exam.venue}</td>
                      <td className="py-2 px-4">{exam.examCollage}</td>
                      <td className="py-2 px-4">{exam.examDepartment}</td>
                      <td className="py-2 px-4">{exam.examDuration} min</td>
                      <td className="py-2 px-4">
                        <StatusBadge status={exam.examStatus} />
                      </td>
                      <td className="py-2 px-4">
                        <StatusActions exam={exam} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-500">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span>No exams scheduled yet.</span>
              </div>
            </div>
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
                      Duration: {exam.examDuration} min
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm">{formatDate(exam.examDate)}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{exam.examTime}</span>
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