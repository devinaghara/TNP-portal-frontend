import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, PlusCircle, ClipboardList, FileText } from "lucide-react";
import axios from "axios";
import PlacementStatisticsForm from "../../components/Faculty/PlacementStatisticsForm";

const PlacementStatistics = () => {
  // State for years and other data
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placementData, setPlacementData] = useState(null);
  const [allPlacementData, setAllPlacementData] = useState([]); // Store all years' data

  // Department options from the mongoose schema enum
  const departmentOptions = [
    "CE",
    "CSE",
    "IT",
    "ME",
    "EE",
    "EC",
    "DCE",
    "DCS",
    "DIT",
  ];

  // Form data structure
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

  // Fetch all placement data on component mount
  useEffect(() => {
    fetchAllPlacementData();
  }, []);

  // Fetch data for a specific year when selected
  useEffect(() => {
    if (selectedYear && allPlacementData.length > 0) {
      const yearData = allPlacementData.find(
        (data) => data.academicYear === selectedYear
      );
      if (yearData) {
        const formattedData = {
          year: yearData.academicYear,
          numberOfCompanies: yearData.noOfCompanies,
          departments: yearData.departments,
          total: yearData.total,
        };
        setPlacementData(formattedData);
      }
    }
  }, [selectedYear, allPlacementData]);

  // Initialize departments array with empty data
  useEffect(() => {
    const initialDepartments = departmentOptions.map((dept) => ({
      name: dept,
      totalStudents: 0,
      interestedForJob: 0,
      studentsPlaced: 0,
      placementPercentage: 0,
    }));

    setFormData((prev) => ({
      ...prev,
      departments: initialDepartments,
    }));
  }, []);

  // Calculate overall totals based on department data
  const totals = useMemo(() => {
    const totalStudents = formData.departments.reduce(
      (sum, dept) => sum + (dept.totalStudents || 0),
      0
    );
    const interestedForJob = formData.departments.reduce(
      (sum, dept) => sum + (dept.interestedForJob || 0),
      0
    );
    const studentsPlaced = formData.departments.reduce(
      (sum, dept) => sum + (dept.studentsPlaced || 0),
      0
    );
    const placementPercentage =
      interestedForJob > 0
        ? parseFloat(((studentsPlaced / interestedForJob) * 100).toFixed(2))
        : 0;

    return {
      totalStudents,
      interestedForJob,
      studentsPlaced,
      placementPercentage,
    };
  }, [formData.departments]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total: totals,
    }));
  }, [totals]);

  // Sort years in lexicographic order (descending)
  const sortYears = (yearsList) => {
    return [...yearsList].sort((a, b) => b.localeCompare(a));
  };

  // Fetch all placement data
  const fetchAllPlacementData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:3003/api/placement-data/placements",
        {
          withCredentials: true,
        }
      );

      let dataArray = [];
      if (Array.isArray(response.data)) {
        dataArray = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        dataArray = response.data.data;
      } else {
        console.error("API response does not contain an array:", response.data);
        setError("Unexpected data format received from server");
        setYears([]);
        setAllPlacementData([]);
        setLoading(false);
        return;
      }

      // Store all data
      setAllPlacementData(dataArray);

      // Extract and sort years
      const yearsList = dataArray.map((data) => data.academicYear);
      const sortedYears = sortYears(yearsList);
      setYears(sortedYears);

      // Set the latest year as selected if available and no year is currently selected
      if (sortedYears.length > 0 && !selectedYear) {
        setSelectedYear(sortedYears[0]);
      }

      setLoading(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch placement data.";
      console.error("Error fetching placement data:", errorMessage, err);
      setError(errorMessage);
      setYears([]);
      setAllPlacementData([]);
      setLoading(false);
    }
  };

  // Add new placement data
  const addPlacementData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const backendData = {
        academicYear: data.year,
        noOfCompanies: data.numberOfCompanies,
        departments: data.departments,
        total: data.total,
      };

      const response = await axios.post(
        `http://localhost:3003/api/placement-data/placement/${data.year}`,
        backendData,
        {
          withCredentials: true,
        }
      );

      // Update all placement data array with the new data
      setAllPlacementData((prev) => {
        const updatedData = [...prev];
        const existingIndex = updatedData.findIndex(
          (item) => item.academicYear === data.year
        );

        if (existingIndex >= 0) {
          updatedData[existingIndex] = response.data;
        } else {
          updatedData.push(response.data);
        }

        return updatedData;
      });

      // Update years list if needed and sort
      setYears((prev) => {
        const updatedYears = prev.includes(data.year)
          ? prev
          : [...prev, data.year];
        return sortYears(updatedYears);
      });

      // Set the selected year to the newly added year
      setSelectedYear(data.year);

      // Update placement data for the current view
      setPlacementData({
        year: response.data.academicYear,
        numberOfCompanies: response.data.noOfCompanies,
        departments: response.data.departments,
        total: response.data.total,
      });

      // Close modal and reset form
      setIsModalOpen(false);

      // Reset form data to initial state
      const initialDepartments = departmentOptions.map((dept) => ({
        name: dept,
        totalStudents: 0,
        interestedForJob: 0,
        studentsPlaced: 0,
        placementPercentage: 0,
      }));

      setFormData({
        year: "",
        numberOfCompanies: 0,
        departments: initialDepartments,
        total: {
          totalStudents: 0,
          interestedForJob: 0,
          studentsPlaced: 0,
          placementPercentage: 0,
        },
      });

      // Clear validation errors
      setValidationErrors({});

      setLoading(false);
      console.log("Placement data added successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to add placement data.";
      console.error("Error adding placement data:", errorMessage, err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Update existing placement data
  const updatePlacementData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const updatePromises = data.departments.map((dept) => {
        return axios.put(
          `http://localhost:3003/api/placement-data/placement/${data.year}/${dept.name}`,
          {
            totalStudents: dept.totalStudents,
            interestedForJob: dept.interestedForJob,
            studentsPlaced: dept.studentsPlaced,
            placementPercentage: dept.placementPercentage,
          },
          {
            withCredentials: true,
          }
        );
      });

      await Promise.all(updatePromises);

      // Fetch the updated data for the current year
      const response = await axios.get(
        `http://localhost:3003/api/placement-data/placement/${data.year}`,
        {
          withCredentials: true,
        }
      );

      // Update all placement data array
      setAllPlacementData((prev) => {
        const updatedData = [...prev];
        const existingIndex = updatedData.findIndex(
          (item) => item.academicYear === data.year
        );

        if (existingIndex >= 0) {
          updatedData[existingIndex] = response.data;
        }

        return updatedData;
      });

      // Update placement data for the current view
      setPlacementData({
        year: response.data.academicYear,
        numberOfCompanies: response.data.noOfCompanies,
        departments: response.data.departments,
        total: response.data.total,
      });

      // Close modal and reset form
      setIsModalOpen(false);

      // Reset form data to initial state
      const initialDepartments = departmentOptions.map((dept) => ({
        name: dept,
        totalStudents: 0,
        interestedForJob: 0,
        studentsPlaced: 0,
        placementPercentage: 0,
      }));

      setFormData({
        year: "",
        numberOfCompanies: 0,
        departments: initialDepartments,
        total: {
          totalStudents: 0,
          interestedForJob: 0,
          studentsPlaced: 0,
          placementPercentage: 0,
        },
      });

      // Clear validation errors
      setValidationErrors({});

      setLoading(false);
      console.log("Placement data updated successfully");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update placement data.";
      console.error("Error updating placement data:", errorMessage, err);
      setError(errorMessage);
      setLoading(false);
    }
  };

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
    let parsedValue =
      field === "placementPercentage"
        ? parseFloat(value)
        : parseInt(value, 10) || 0;

    if (field === "interestedForJob" && parsedValue > dept.totalStudents) {
      setValidationErrors({
        ...validationErrors,
        [`${dept.name}-${field}`]: "Cannot exceed total students",
      });
      return;
    } else if (
      field === "studentsPlaced" &&
      parsedValue > dept.interestedForJob
    ) {
      setValidationErrors({
        ...validationErrors,
        [`${dept.name}-${field}`]: "Cannot exceed interested students",
      });
      return;
    }

    if (validationErrors[`${dept.name}-${field}`]) {
      const newErrors = { ...validationErrors };
      delete newErrors[`${dept.name}-${field}`];
      setValidationErrors(newErrors);
    }

    if (field === "studentsPlaced" || field === "interestedForJob") {
      const studentsPlaced =
        field === "studentsPlaced" ? parsedValue : dept.studentsPlaced;
      const interestedForJob =
        field === "interestedForJob" ? parsedValue : dept.interestedForJob;

      updatedDepartments[deptIndex] = {
        ...dept,
        [field]: parsedValue,
        placementPercentage:
          interestedForJob > 0
            ? parseFloat(((studentsPlaced / interestedForJob) * 100).toFixed(2))
            : 0,
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

  const validateForm = () => {
    const errors = {};

    if (!formData.year.trim()) {
      errors.year = "Academic year is required";
    }

    if (!formData.numberOfCompanies || formData.numberOfCompanies <= 0) {
      errors.numberOfCompanies =
        "Number of companies is required and must be greater than 0";
    }

    const hasDepartmentData = formData.departments.some(
      (dept) =>
        dept.totalStudents > 0 ||
        dept.interestedForJob > 0 ||
        dept.studentsPlaced > 0
    );

    if (!hasDepartmentData) {
      errors.departments = "Data for at least one department is required";
    }

    formData.departments.forEach((dept) => {
      if (dept.interestedForJob > dept.totalStudents) {
        errors[`${dept.name}-interestedForJob`] =
          "Cannot exceed total students";
      }

      if (dept.studentsPlaced > dept.interestedForJob) {
        errors[`${dept.name}-studentsPlaced`] =
          "Cannot exceed interested students";
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (data) => {
    if (!validateForm()) {
      return;
    }

    const existingYearIndex = years.findIndex((year) => year === data.year);

    if (existingYearIndex >= 0) {
      updatePlacementData(data);
    } else {
      addPlacementData(data);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);

    // Reset form data to initial state
    const initialDepartments = departmentOptions.map((dept) => ({
      name: dept,
      totalStudents: 0,
      interestedForJob: 0,
      studentsPlaced: 0,
      placementPercentage: 0,
    }));

    setFormData({
      year: "",
      numberOfCompanies: 0,
      departments: initialDepartments,
      total: {
        totalStudents: 0,
        interestedForJob: 0,
        studentsPlaced: 0,
        placementPercentage: 0,
      },
    });

    // Clear validation errors
    setValidationErrors({});
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Placement Statistics
            </h1>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={loading || years.length === 0}
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
                            selectedYear === year
                              ? "bg-blue-50 text-blue-600"
                              : ""
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
                      <div className="px-4 py-2 text-gray-500">
                        No data available
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Entry</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && placementData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {placementData.total?.totalStudents || 0}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">
                    Interested for Job
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {placementData.total?.interestedForJob || 0}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <p className="text-sm text-purple-600 font-medium">
                    Students Placed
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    {placementData.total?.studentsPlaced || 0}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <p className="text-sm text-amber-600 font-medium">
                    Placement Percentage
                  </p>
                  <p className="text-2xl font-bold text-amber-800">
                    {(placementData.total?.placementPercentage || 0).toFixed(2)}
                    %
                  </p>
                </div>
              </div>

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
                      {(placementData.departments || []).map(
                        (dept) =>
                          (dept.totalStudents > 0 ||
                            dept.interestedForJob > 0 ||
                            dept.studentsPlaced > 0) && (
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
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    dept.placementPercentage >= 85
                                      ? "bg-green-100 text-green-800"
                                      : dept.placementPercentage >= 70
                                      ? "bg-blue-100 text-blue-800"
                                      : dept.placementPercentage >= 50
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {dept.placementPercentage.toFixed(2)}%
                                </span>
                              </td>
                            </tr>
                          )
                      )}
                      <tr className="bg-gray-50 font-bold">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                          Total
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800">
                          {placementData.total?.totalStudents || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800">
                          {placementData.total?.interestedForJob || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-800">
                          {placementData.total?.studentsPlaced || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              (placementData.total?.placementPercentage || 0) >=
                              85
                                ? "bg-green-100 text-green-800"
                                : (placementData.total?.placementPercentage ||
                                    0) >= 70
                                ? "bg-blue-100 text-blue-800"
                                : (placementData.total?.placementPercentage ||
                                    0) >= 50
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {(
                              placementData.total?.placementPercentage || 0
                            ).toFixed(2)}
                            %
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!loading && !error && (!placementData || years.length === 0) && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                No placement data available yet.
              </p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Add Your First Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <PlacementStatisticsForm
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          initialData={null}
        />
      )}
    </div>
  );
};

export default PlacementStatistics;
