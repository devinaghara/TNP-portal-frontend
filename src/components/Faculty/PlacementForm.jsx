import React, { useState } from "react";
import axios from "axios";

const AddPlacementData = () => {
  const [year, setYear] = useState("");
  const [noOfCompanies, setNoOfCompanies] = useState("");
  const [departments, setDepartments] = useState([
    { name: "", totalStudents: "", interestedForJob: "", studentsPlaced: "" },
  ]);

  const handleDepartmentChange = (index, field, value) => {
    const updated = [...departments];
    updated[index][field] = value;
    setDepartments(updated);
  };

  const addDepartment = () => {
    setDepartments([
      ...departments,
      { name: "", totalStudents: "", interestedForJob: "", studentsPlaced: "" },
    ]);
  };

  const removeDepartment = (index) => {
    const updated = departments.filter((_, i) => i !== index);
    setDepartments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      noOfCompanies: Number(noOfCompanies),
      departments: departments.map((dept) => ({
        name: dept.name,
        totalStudents: Number(dept.totalStudents),
        interestedForJob: Number(dept.interestedForJob),
        studentsPlaced: Number(dept.studentsPlaced),
      })),
    };
    console.log(payload);
    try {
      console.log(`${
          import.meta.env.VITE_BACKEND_URL
        }/api/placement-data/placement/${year}`);
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/placement-data/placement/${year}`,
        payload
      );

      alert("Data added!");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting data");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Placement Data</h2>
      <input
        type="text"
        placeholder="Academic Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Number of Companies"
        value={noOfCompanies}
        onChange={(e) => setNoOfCompanies(e.target.value)}
        required
      />

      {departments.map((dept, index) => (
        <div key={index}>
          <select
            value={dept.name}
            onChange={(e) =>
              handleDepartmentChange(index, "name", e.target.value)
            }
            required
          >
            <option value="">Select Department</option>
            <option value="CE">CE</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
            <option value="EE">EE</option>
            <option value="EC">EC</option>
            <option value="DCE">DCE</option>
            <option value="DCS">DCS</option>
            <option value="DIT">DIT</option>
          </select>
          <input
            type="number"
            placeholder="Total Students"
            value={dept.totalStudents}
            onChange={(e) =>
              handleDepartmentChange(index, "totalStudents", e.target.value)
            }
            required
          />
          <input
            type="number"
            placeholder="Interested for Job"
            value={dept.interestedForJob}
            onChange={(e) =>
              handleDepartmentChange(index, "interestedForJob", e.target.value)
            }
            required
          />
          <input
            type="number"
            placeholder="Students Placed"
            value={dept.studentsPlaced}
            onChange={(e) =>
              handleDepartmentChange(index, "studentsPlaced", e.target.value)
            }
            required
          />
          {departments.length > 1 && (
            <button type="button" onClick={() => removeDepartment(index)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addDepartment}>
        Add Another Department
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddPlacementData;
