import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const PlacementStatisticsForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  // Department options from the mongoose schema enum
  const departmentOptions = ["CE", "CSE", "IT", "ME", "EE", "EC", "DCE", "DCS", "DIT"];

  const [formData, setFormData] = useState({
    year: "",
    noOfCompanies: 0, // Changed to match API field
    departments: [],
    total: {
      totalStudents: 0,
      interestedForJob: 0,
      studentsPlaced: 0,
      placementPercentage: 0,
    },
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Initialize departments array with empty data
  useEffect(() => {
    const initialDepartments = departmentOptions.map((dept) => ({
      name: dept,
      totalStudents: 0,
      interestedForJob: 0,
      studentsPlaced: 0,
      placementPercentage: 0, // For display only
    }));

    setFormData((prev) => ({
      ...prev,
      departments: initialDepartments,
      noOfCompanies: initialData?.noOfCompanies || 0,
      year: initialData?.year || "", // Use year for form input
    }));

    // Populate form with initialData if provided
    if (initialData) {
      setFormData({
        year: initialData.year || initialData.academicYear || "",
        noOfCompanies: initialData.noOfCompanies || initialData.numberOfCompanies || 0,
        departments: initialDepartments.map((dept) => {
          const existingDept = initialData.departments.find((d) => d.name === dept.name);
          return existingDept
            ? {
                ...existingDept,
                placementPercentage: existingDept.placementPercentage || 0,
              }
            : dept;
        }),
        total: initialData.total || {
          totalStudents: 0,
          interestedForJob: 0,
          studentsPlaced: 0,
          placementPercentage: 0,
        },
      });
    }
  }, [initialData]);

  // Calculate overall totals based on department data
  useEffect(() => {
    const totals = calculateTotals();
    setFormData((prev) => ({
      ...prev,
      total: totals,
    }));
  }, [formData.departments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "noOfCompanies" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleDepartmentChange = (deptIndex, field, value) => {
    const updatedDepartments = [...formData.departments];
    const dept = updatedDepartments[deptIndex];
    const parsedValue = parseInt(value, 10) || 0; // All fields are integers except placementPercentage

    // Validate based on field
    if (field === "interestedForJob" && parsedValue > dept.totalStudents) {
      setValidationErrors({
        ...validationErrors,
        [`${dept.name}-${field}`]: "Cannot exceed total students",
      });
      return;
    } else if (field === "studentsPlaced" && parsedValue > dept.interestedForJob) {
      setValidationErrors({
        ...validationErrors,
        [`${dept.name}-${field}`]: "Cannot exceed interested students",
      });
      return;
    }

    // Clear validation error if it exists
    if (validationErrors[`${dept.name}-${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`${dept.name}-${field}`];
      setValidationErrors(newErrors);
    }

    // Update department data
    if (field === "studentsPlaced" || field === "interestedForJob") {
      const studentsPlaced = field === "studentsPlaced" ? parsedValue : dept.studentsPlaced;
      const interestedForJob = field === "interestedForJob" ? parsedValue : dept.interestedForJob;

      updatedDepartments[deptIndex] = {
        ...dept,
        [field]: parsedValue,
        placementPercentage: interestedForJob > 0 ? parseFloat(((studentsPlaced / interestedForJob) * 100).toFixed(2)) : 0,
      };
    } else {
      updatedDepartments[deptIndex] = {
        ...dept,
        [field]: parsedValue,
      };
    }

    setFormData((prev) => ({
      ...prev,
      departments: updatedDepartments,
    }));
  };

  const calculateTotals = () => {
    const totalStudents = formData.departments.reduce((sum, dept) => sum + (dept.totalStudents || 0), 0);
    const interestedForJob = formData.departments.reduce(
      (sum, dept) => sum + (dept.interestedForJob || 0),
      0
    );
    const studentsPlaced = formData.departments.reduce((sum, dept) => sum + (dept.studentsPlaced || 0), 0);
    const placementPercentage = interestedForJob > 0 ? parseFloat(((studentsPlaced / interestedForJob) * 100).toFixed(2)) : 0;

    return {
      totalStudents,
      interestedForJob,
      studentsPlaced,
      placementPercentage,
    };
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.year.trim()) {
      errors.year = "Academic year is required";
    }

    if (!formData.noOfCompanies || formData.noOfCompanies <= 0) {
      errors.noOfCompanies = "Number of companies must be greater than 0";
    }

    const hasDepartmentData = formData.departments.some(
      (dept) => dept.totalStudents > 0 || dept.interestedForJob > 0 || dept.studentsPlaced > 0
    );

    if (!hasDepartmentData) {
      errors.departments = "Data for at least one department is required";
    }

    formData.departments.forEach((dept) => {
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Prepare payload for API
      const payload = {
        noOfCompanies: formData.noOfCompanies,
        departments: formData.departments
          .filter((dept) => dept.totalStudents > 0) // Only include departments with data
          .map(({ name, totalStudents, interestedForJob, studentsPlaced }) => ({
            name,
            totalStudents,
            interestedForJob,
            studentsPlaced,
          })),
      };

      let response;

      if (initialData) {
        // Update existing year data
        response = await axios.put(
          `http://localhost:3003/api/placement-data/placement/${formData.year}`,
          payload,
          { withCredentials: true }
        );
      } else {
        // Add new year data
        response = await axios.post(
          `http://localhost:3003/api/placement-data/placement/${formData.year}`,
          payload,
          { withCredentials: true }
        );
      }

      // Format response to match parent component expectations
      const formattedData = {
        academicYear: formData.year, // API expects year as academicYear
        noOfCompanies: response.data.data.noOfCompanies,
        departments: response.data.data.departments,
        total: response.data.data.total,
      };

      onSubmit(formattedData);
      onClose();
    } catch (error) {
      console.error("API Error:", error);
      setApiError(
        error.response?.data?.message || "Failed to save placement data. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Placement Data" : "Add Placement Data"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{apiError}</p>
          </div>
        )}

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.year ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. 2024-2025"
                disabled={initialData} // Disable year editing for updates
              />
              {validationErrors.year && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.year}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Companies *
              </label>
              <input
                type="number"
                name="noOfCompanies"
                value={formData.noOfCompanies}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.noOfCompanies ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter number"
                min="0"
              />
              {validationErrors.noOfCompanies && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.noOfCompanies}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-semibold text-gray-800">Department-wise Data *</h3>
              {validationErrors.departments && (
                <p className="text-sm text-red-600">{validationErrors.departments}</p>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Students
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interested for Job
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students Placed
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placement %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.departments.map((dept, index) => (
                      <tr key={dept.name}>
                        <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-700">
                          {dept.name}
                        </td>
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
                              onChange={(e) =>
                                handleDepartmentChange(index, "interestedForJob", e.target.value)
                              }
                              className={`w-full px-2 py-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                validationErrors[`${dept.name}-interestedForJob`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              min="0"
                            />
                            {validationErrors[`${dept.name}-interestedForJob`] && (
                              <p className="mt-1 text-xs text-red-600">
                                {validationErrors[`${dept.name}-interestedForJob`]}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div>
                            <input
                              type="number"
                              value={dept.studentsPlaced}
                              onChange={(e) =>
                                handleDepartmentChange(index, "studentsPlaced", e.target.value)
                              }
                              className={`w-full px-2 py-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                validationErrors[`${dept.name}-studentsPlaced`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              min="0"
                            />
                            {validationErrors[`${dept.name}-studentsPlaced`] && (
                              <p className="mt-1 text-xs text-red-600">
                                {validationErrors[`${dept.name}-studentsPlaced`]}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            value={dept.placementPercentage.toFixed(2)}
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

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-base font-semibold text-blue-800 mb-3">
              Overall Placement Statistics (Auto-calculated)
            </h3>
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
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Interested For Job
                </label>
                <input
                  type="number"
                  value={formData.total.interestedForJob}
                  readOnly
                  className="w-full px-3 py-2 border bg-white rounded-md shadow-sm text-blue-800 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Students Placed
                </label>
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
                  value={formData.total.placementPercentage.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border bg-white rounded-md shadow-sm text-blue-800 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlacementStatisticsForm;