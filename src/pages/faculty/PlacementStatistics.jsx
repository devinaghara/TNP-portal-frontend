import React, { useState, useEffect } from "react";
import { ChevronDown, PlusCircle, ClipboardList, FileText, X } from "lucide-react";

const PlacementStatistics = () => {
  // Dummy data for years
  const initialYears = ["2022-2023", "2023-2024"];
  
  const [years, setYears] = useState(initialYears);
  const [selectedYear, setSelectedYear] = useState("2023-2024");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Department options from the mongoose schema enum
  const departmentOptions = ["CE", "CSE", "IT", "ME", "EE", "EC", "DCE", "DCS", "DIT"];

  // Dummy data for placement statistics
  const dummyPlacementData = {
    "2022-2023": {
      year: "2022-2023",
      numberOfCompanies: 45,
      departments: departmentOptions.map(dept => ({
        name: dept,
        totalStudents: Math.floor(Math.random() * 100) + 50,
        interestedForJob: Math.floor(Math.random() * 80) + 40,
        studentsPlaced: Math.floor(Math.random() * 60) + 30,
        placementPercentage: Math.floor(Math.random() * 30) + 70
      })),
      total: {
        totalStudents: 743,
        interestedForJob: 623,
        studentsPlaced: 534,
        placementPercentage: 85.71
      }
    },
    "2023-2024": {
      year: "2023-2024",
      numberOfCompanies: 58,
      departments: departmentOptions.map(dept => ({
        name: dept,
        totalStudents: Math.floor(Math.random() * 100) + 60,
        interestedForJob: Math.floor(Math.random() * 85) + 50,
        studentsPlaced: Math.floor(Math.random() * 70) + 40,
        placementPercentage: Math.floor(Math.random() * 20) + 75
      })),
      total: {
        totalStudents: 812,
        interestedForJob: 704,
        studentsPlaced: 628,
        placementPercentage: 89.2
      }
    }
  };

  const [placementData, setPlacementData] = useState(dummyPlacementData[selectedYear]);

  // Updated form data structure
  const [formData, setFormData] = useState({
    year: "",
    numberOfCompanies: 0,
    departments: [],
    total: {
      totalStudents: 0,
      interestedForJob: 0,
      studentsPlaced: 0,
      placementPercentage: 0,
    },
  });

  // Initialize departments array with empty data
  useEffect(() => {
    const initialDepartments = departmentOptions.map(dept => ({
      name: dept,
      totalStudents: 0,
      interestedForJob: 0,
      studentsPlaced: 0,
      placementPercentage: 0
    }));
    
    setFormData(prev => ({
      ...prev,
      departments: initialDepartments
    }));
  }, []);

  // Calculate overall totals based on department data
  useEffect(() => {
    const totals = calculateTotals();
    setFormData(prev => ({
      ...prev,
      total: totals
    }));
  }, [formData.departments]);

  // Update displayed data when selected year changes
  useEffect(() => {
    if (selectedYear && dummyPlacementData[selectedYear]) {
      setPlacementData(dummyPlacementData[selectedYear]);
    }
  }, [selectedYear]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (deptIndex, field, value) => {
    const updatedDepartments = [...formData.departments];
    const dept = updatedDepartments[deptIndex];
    let parsedValue = field === "placementPercentage" ? parseFloat(value) : parseInt(value, 10) || 0;
    
    // Validate based on field
    if (field === "interestedForJob" && parsedValue > dept.totalStudents) {
      setValidationErrors({
        ...validationErrors,
        [`${dept.name}-${field}`]: "Cannot exceed total students"
      });
      return;
    } else if (field === "studentsPlaced" && parsedValue > dept.interestedForJob) {
      setValidationErrors({
        ...validationErrors,
        [`${dept.name}-${field}`]: "Cannot exceed interested students"
      });
      return;
    }
    
    // Clear validation error if it exists
    if (validationErrors[`${dept.name}-${field}`]) {
      const newErrors = {...validationErrors};
      delete newErrors[`${dept.name}-${field}`];
      setValidationErrors(newErrors);
    }
    
    // Update the department data
    if (field === "studentsPlaced" || field === "interestedForJob") {
      const studentsPlaced = field === "studentsPlaced" ? parsedValue : dept.studentsPlaced;
      const interestedForJob = field === "interestedForJob" ? parsedValue : dept.interestedForJob;
      
      updatedDepartments[deptIndex] = {
        ...dept,
        [field]: parsedValue,
        placementPercentage: interestedForJob > 0 
          ? parseFloat(((studentsPlaced / interestedForJob) * 100).toFixed(2)) 
          : 0
      };
    } else {
      updatedDepartments[deptIndex] = {
        ...dept,
        [field]: parsedValue
      };
    }
    
    setFormData((prev) => ({
      ...prev,
      departments: updatedDepartments
    }));
  };

  const calculateTotals = () => {
    const totalStudents = formData.departments.reduce(
      (sum, dept) => sum + (dept.totalStudents || 0), 0
    );
    
    const interestedForJob = formData.departments.reduce(
      (sum, dept) => sum + (dept.interestedForJob || 0), 0
    );
    
    const studentsPlaced = formData.departments.reduce(
      (sum, dept) => sum + (dept.studentsPlaced || 0), 0
    );
    
    const placementPercentage = interestedForJob > 0
      ? parseFloat(((studentsPlaced / interestedForJob) * 100).toFixed(2))
      : 0;
    
    return {
      totalStudents,
      interestedForJob,
      studentsPlaced,
      placementPercentage
    };
  };

  const validateForm = () => {
    const errors = {};
    
    // Check if year is provided
    if (!formData.year.trim()) {
      errors.year = "Academic year is required";
    }
    
    // Check if number of companies is provided
    if (!formData.numberOfCompanies) {
      errors.numberOfCompanies = "Number of companies is required";
    }
    
    // Check if at least one department has data
    const hasDepartmentData = formData.departments.some(
      dept => dept.totalStudents > 0 || dept.interestedForJob > 0 || dept.studentsPlaced > 0
    );
    
    if (!hasDepartmentData) {
      errors.departments = "Data for at least one department is required";
    }
    
    // Check for department-level validation errors
    formData.departments.forEach((dept, index) => {
      if (dept.interestedForJob > dept.totalStudents) {
        errors[`${dept.name}-interestedForJob`] = "Cannot exceed total students";
      }
      
      if (dept.studentsPlaced > dept.interestedForJob) {
        errors[`${dept.name}-studentsPlaced`] = "Cannot exceed interested students";
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Prepare final data
    const finalData = {
      ...formData,
      numberOfCompanies: parseInt(formData.numberOfCompanies, 10)
    };
    
    console.log("Submitted Data:", finalData);
    setIsModalOpen(false);
    
    // Here you would typically send the data to your API
    // For now, we'll update the local state
    setPlacementData(finalData);
    
    // Add the new year to the years list if it's not already there
    if (!years.includes(finalData.year)) {
      setYears([...years, finalData.year]);
    }
    
    setSelectedYear(finalData.year);
    
    // Update dummy data
    dummyPlacementData[finalData.year] = finalData;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Placement Statistics</h1>
            
            <div className="flex gap-3">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{selectedYear || "Select Year"}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {years.length > 0 ? (
                      years.map((year) => (
                        <div
                          key={year}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                            selectedYear === year ? "bg-blue-50 text-blue-600" : ""
                          }`}
                          onClick={() => {
                            setSelectedYear(year);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {year}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No data available</div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Entry</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          {placementData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-blue-800">{placementData.total.totalStudents}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Interested for Job</p>
                <p className="text-2xl font-bold text-green-800">{placementData.total.interestedForJob}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium">Students Placed</p>
                <p className="text-2xl font-bold text-purple-800">{placementData.total.studentsPlaced}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <p className="text-sm text-amber-600 font-medium">Placement Percentage</p>
                <p className="text-2xl font-bold text-amber-800">{placementData.total.placementPercentage}%</p>
              </div>
            </div>
          )}

          {/* Display Placement Data */}
          {placementData && (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Placement Data for {placementData.year}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Number of Companies: {placementData.numberOfCompanies}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                      <FileText className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                      <ClipboardList className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Students
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interested for Job
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students Placed
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placement %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {placementData.departments.map((dept) => (
                      dept.totalStudents > 0 || dept.interestedForJob > 0 || dept.studentsPlaced > 0 ? (
                        <tr key={dept.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                            {dept.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                            {dept.totalStudents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                            {dept.interestedForJob}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">
                            {dept.studentsPlaced}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              dept.placementPercentage >= 85 ? 'bg-green-100 text-green-800' :
                              dept.placementPercentage >= 70 ? 'bg-blue-100 text-blue-800' :
                              dept.placementPercentage >= 50 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {dept.placementPercentage}%
                            </span>
                          </td>
                        </tr>
                      ) : null
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800">
                        {placementData.total.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800">
                        {placementData.total.interestedForJob}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800">
                        {placementData.total.studentsPlaced}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          placementData.total.placementPercentage >= 85 ? 'bg-green-100 text-green-800' :
                          placementData.total.placementPercentage >= 70 ? 'bg-blue-100 text-blue-800' :
                          placementData.total.placementPercentage >= 50 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {placementData.total.placementPercentage}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding new entry */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Placement Data</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validationErrors.year ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. 2024-2025"
                  />
                  {validationErrors.year && <p className="mt-1 text-sm text-red-600">{validationErrors.year}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Companies *</label>
                  <input
                    type="number"
                    name="numberOfCompanies"
                    value={formData.numberOfCompanies}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validationErrors.numberOfCompanies ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter number"
                    min="0"
                  />
                  {validationErrors.numberOfCompanies && <p className="mt-1 text-sm text-red-600">{validationErrors.numberOfCompanies}</p>}
                </div>
              </div>
              
              {/* Department-wise Data */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-semibold text-gray-800">Department-wise Data *</h3>
                  {validationErrors.departments && <p className="text-sm text-red-600">{validationErrors.departments}</p>}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interested for Job</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students Placed</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placement %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {formData.departments.map((dept, index) => (
                          <tr key={dept.name}>
                            <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-700">{dept.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={dept.totalStudents}
                                onChange={(e) => handleDepartmentChange(index, "totalStudents", e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div>
                                <input
                                  type="number"
                                  value={dept.interestedForJob}
                                  onChange={(e) => handleDepartmentChange(index, "interestedForJob", e.target.value)}
                                  className={`w-full px-2 py-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validationErrors[`${dept.name}-interestedForJob`] ? 'border-red-500' : 'border-gray-300'}`}
                                  min="0"
                                />
                                {validationErrors[`${dept.name}-interestedForJob`] && 
                                  <p className="mt-1 text-xs text-red-600">{validationErrors[`${dept.name}-interestedForJob`]}</p>
                                }
                              </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div>
                                <input
                                  type="number"
                                  value={dept.studentsPlaced}
                                  onChange={(e) => handleDepartmentChange(index, "studentsPlaced", e.target.value)}
                                  className={`w-full px-2 py-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validationErrors[`${dept.name}-studentsPlaced`] ? 'border-red-500' : 'border-gray-300'}`}
                                  min="0"
                                />
                                {validationErrors[`${dept.name}-studentsPlaced`] && 
                                  <p className="mt-1 text-xs text-red-600">{validationErrors[`${dept.name}-studentsPlaced`]}</p>
                                }
                              </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <input
                                type="text"
                                value={dept.placementPercentage}
                                readOnly
                                className="w-full px-2 py-1 border bg-gray-100 rounded-md"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Overall Totals Section */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-base font-semibold text-blue-800 mb-3">Overall Placement Statistics (Auto-calculated)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Total Students</label>
                    <input
                      type="number"
                      value={formData.total.totalStudents}
                      readOnly
                      className="w-full px-3 py-2 border bg-white rounded-md shadow-sm text-blue-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Interested For Job</label>
                    <input
                      type="number"
                      value={formData.total.interestedForJob}
                      readOnly
                      className="w-full px-3 py-2 border bg-white rounded-md shadow-sm text-blue-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Students Placed</label>
                    <input
                      type="number"
                      value={formData.total.studentsPlaced}
                      readOnly
                      className="w-full px-3 py-2 border bg-white rounded-md shadow-sm text-blue-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Placement %</label>
                    <input
                      type="text"
                      value={formData.total.placementPercentage}
                      readOnly
                      className="w-full px-3 py-2 border bg-white rounded-md shadow-sm text-blue-800 font-medium"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementStatistics;