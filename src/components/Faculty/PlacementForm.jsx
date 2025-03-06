import React, { useState } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';
import { Label } from 'recharts';

const COLLEGES = ['CSPIT', 'DEPSTAR'];
const DEPARTMENTS = {
  'CSPIT': ['CE', 'IT', 'CSE', 'EC', 'ME', 'CL', 'EE'],
  'DEPSTAR': ['CE', 'IT', 'CSE']
};

const PlacementForm = () => {
  const [formData, setFormData] = useState({
    academicYear: '',
    totalCompaniesVisited: 0,
    overallStats: {
      totalStudents: 0,
      totalInterestedStudents: 0,
      totalPlacedStudents: 0,
      highestPackageOffered: 0,
      averagePackage: 0
    },
    collegeStats: [],
    metadata: {
      topRecruiters: []
    }
  });

  const [currentCollege, setCurrentCollege] = useState('');
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [currentRecruiter, setCurrentRecruiter] = useState({
    companyName: '',
    studentsHired: 0,
    maxPackageOffered: 0
  });
  const [isRecruitersDialogOpen, setIsRecruitersDialogOpen] = useState(false);

  // (All previous handler functions remain the same)
  // ... (Keep all the existing handler functions like handleOverallStatsChange, addCollege, etc.)

  // Overall Stats Handlers
  const handleOverallStatsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      overallStats: {
        ...prev.overallStats,
        [name]: Number(value)
      }
    }));
  };

  // College Handlers
  const addCollege = () => {
    if (!currentCollege) return;

    // Check if college already exists
    const collegeExists = formData.collegeStats.some(
      college => college.collegeName === currentCollege
    );

    if (collegeExists) {
      alert(`${currentCollege} college is already added`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      collegeStats: [
        ...prev.collegeStats,
        {
          collegeName: currentCollege,
          totalStudents: 0,
          totalInterestedStudents: 0,
          totalPlacedStudents: 0,
          departmentStats: []
        }
      ]
    }));
    setCurrentCollege('');
  };

  const removeCollege = (index) => {
    const updatedCollegeStats = formData.collegeStats.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      collegeStats: updatedCollegeStats
    }));
  };

  const updateCollegeStats = (collegeIndex, field, value) => {
    const updatedCollegeStats = [...formData.collegeStats];
    updatedCollegeStats[collegeIndex][field] = Number(value);
    setFormData(prev => ({
      ...prev,
      collegeStats: updatedCollegeStats
    }));
  };

  // Department Handlers
  const addDepartmentToCollege = (collegeIndex) => {
    if (!currentDepartment) return;

    const college = formData.collegeStats[collegeIndex];
    const departmentExists = college.departmentStats.some(
      dept => dept.departmentName === currentDepartment
    );

    if (departmentExists) {
      alert(`${currentDepartment} department is already added to ${college.collegeName}`);
      return;
    }

    const updatedCollegeStats = [...formData.collegeStats];
    updatedCollegeStats[collegeIndex].departmentStats.push({
      departmentName: currentDepartment,
      totalStudents: 0,
      interestedStudents: 0,
      placedStudents: 0,
      highestPackage: 0,
      averagePackage: 0,
      lowestPackage: 0
    });

    setFormData(prev => ({
      ...prev,
      collegeStats: updatedCollegeStats
    }));
    setCurrentDepartment('');
  };

  const removeDepartment = (collegeIndex, departmentIndex) => {
    const updatedCollegeStats = [...formData.collegeStats];
    updatedCollegeStats[collegeIndex].departmentStats.splice(departmentIndex, 1);

    setFormData(prev => ({
      ...prev,
      collegeStats: updatedCollegeStats
    }));
  };

  const updateDepartmentStats = (collegeIndex, departmentIndex, field, value) => {
    const updatedCollegeStats = [...formData.collegeStats];
    updatedCollegeStats[collegeIndex].departmentStats[departmentIndex][field] = Number(value);

    setFormData(prev => ({
      ...prev,
      collegeStats: updatedCollegeStats
    }));
  };

  // Top Recruiters Handlers
  const addRecruiter = () => {
    if (!currentRecruiter.companyName) return;

    const recruiterExists = formData.metadata.topRecruiters.some(
      recruiter => recruiter.companyName === currentRecruiter.companyName
    );

    if (recruiterExists) {
      alert(`${currentRecruiter.companyName} is already added`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        topRecruiters: [
          ...prev.metadata.topRecruiters,
          currentRecruiter
        ]
      }
    }));

    // Reset current recruiter
    setCurrentRecruiter({
      companyName: '',
      studentsHired: 0,
      maxPackageOffered: 0
    });
  };

  const removeRecruiter = (index) => {
    const updatedRecruiters = formData.metadata.topRecruiters.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        topRecruiters: updatedRecruiters
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validations
      if (!formData.academicYear.match(/^\d{4}-\d{4}$/)) {
        alert('Invalid academic year format. Use YYYY-YYYY');
        return;
      }

      if (formData.collegeStats.length === 0) {
        alert('Please add at least one college');
        return;
      }

      const response = await axios.post('/api/placement/add', formData);
      alert(response.data.message);

      // Reset form after successful submission
      setFormData({
        academicYear: '',
        totalCompaniesVisited: 0,
        overallStats: {
          totalStudents: 0,
          totalInterestedStudents: 0,
          totalPlacedStudents: 0,
          highestPackageOffered: 0,
          averagePackage: 0
        },
        collegeStats: [],
        metadata: {
          topRecruiters: []
        }
      });
    } catch (error) {
      console.error('Error submitting placement data:', error);
      alert(error.response?.data?.message || 'Failed to submit placement data');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add Placement Data</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Information */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <input
                type="text"
                placeholder="YYYY-YYYY"
                value={formData.academicYear}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  academicYear: e.target.value
                }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Companies Visited
              </label>
              <input
                type="number"
                value={formData.totalCompaniesVisited}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  totalCompaniesVisited: Number(e.target.value)
                }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Total Students</Label>
              <Input
                type="number"
                name="totalStudents"
                value={formData.overallStats.totalStudents}
                onChange={handleOverallStatsChange}
                required
              />
            </div>
            <div>
              <Label>Interested Students</Label>
              <Input
                type="number"
                name="totalInterestedStudents"
                value={formData.overallStats.totalInterestedStudents}
                onChange={handleOverallStatsChange}
                required
              />
            </div>
            <div>
              <Label>Placed Students</Label>
              <Input
                type="number"
                name="totalPlacedStudents"
                value={formData.overallStats.totalPlacedStudents}
                onChange={handleOverallStatsChange}
                required
              />
            </div>
          </div>

          {/* Colleges Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Colleges</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={currentCollege}
                  onChange={(e) => setCurrentCollege(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select College</option>
                  {COLLEGES.map(college => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCollege}
                  disabled={!currentCollege}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add College
                </button>
              </div>
            </div>

            {/* Top Recruiters Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Top Recruiters</h2>
                <button
                  type="button"
                  onClick={() => setIsRecruitersDialogOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Recruiter
                </button>
              </div>

              {/* Recruiters Dialog (Simplified Modal) */}
              {isRecruitersDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h3 className="text-lg font-semibold mb-4">Add Top Recruiter</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          value={currentRecruiter.companyName}
                          onChange={(e) => setCurrentRecruiter(prev => ({
                            ...prev,
                            companyName: e.target.value
                          }))}
                          placeholder="Enter company name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {/* Similar inputs for Students Hired and Max Package */}
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={addRecruiter}
                          disabled={!currentRecruiter.companyName}
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        >
                          Add Recruiter
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsRecruitersDialogOpen(false)}
                          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Recruiters Table */}
              {formData.metadata.topRecruiters.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Company Name</th>
                        <th className="px-4 py-2 text-left">Students Hired</th>
                        <th className="px-4 py-2 text-left">Max Package</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.metadata.topRecruiters.map((recruiter, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{recruiter.companyName}</td>
                          <td className="px-4 py-2">{recruiter.studentsHired}</td>
                          <td className="px-4 py-2">{recruiter.maxPackageOffered}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeRecruiter(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={!formData.academicYear || formData.collegeStats.length === 0}
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                Submit Placement Data
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacementForm;