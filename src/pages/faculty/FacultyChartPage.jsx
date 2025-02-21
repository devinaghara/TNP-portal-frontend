import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from '../../components/Charts/Barchart';

const FacultyChartPage = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    studentsApplied: '',
    studentsPlaced: '',
    companiesHiring: '',
    highestPackage: '',
    averagePackage: '',
    lowestPackage: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const API_BASE_URL = 'http://localhost:3003/chart/chart-data';

  const fetchChartData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL, { withCredentials: true });
      if (response.data.success) {
        setChartData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch chart data');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      year: '',
      studentsApplied: '',
      studentsPlaced: '',
      companiesHiring: '',
      highestPackage: '',
      averagePackage: '',
      lowestPackage: ''
    });
    setEditData(null);
    setError(null);
  };

  const openModal = (data = null) => {
    setIsModalOpen(true);
    if (data) {
      setEditData(data);
      setFormData({
        year: data.year,
        studentsApplied: data.totalStudentsApplied,
        studentsPlaced: data.studentsPlaced,
        companiesHiring: data.companiesHiring,
        highestPackage: data.highestPackage,
        averagePackage: data.averagePackage,
        lowestPackage: data.lowestPackage
      });
    } else {
      resetForm();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const method = editData ? 'put' : 'post';
      const url = editData ? `${API_BASE_URL}/${editData._id}` : API_BASE_URL;

      const payload = {
        year: parseInt(formData.year),
        totalStudentsApplied: parseInt(formData.studentsApplied),
        studentsPlaced: parseInt(formData.studentsPlaced),
        companiesHiring: parseInt(formData.companiesHiring),
        highestPackage: parseFloat(formData.highestPackage),
        averagePackage: parseFloat(formData.averagePackage),
        lowestPackage: parseFloat(formData.lowestPackage)
      };

      const response = await axios({
        method,
        url,
        data: payload,
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to save data');
      }

      await fetchChartData(); // Refresh the chart data
      closeModal();
    } catch (error) {
      setError(error.message);
      console.error('Error saving data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete data');
      }

      await fetchChartData(); // Refresh the chart data
    } catch (error) {
      setError(error.message);
      console.error('Error deleting data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareChartData = (dataType) => {
    const labels = chartData.map(item => item.year);

    switch(dataType) {
      case 'students':
        return {
          labels,
          datasets: [
            {
              label: 'Students Applied',
              data: chartData.map(item => item.totalStudentsApplied),
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              borderColor: 'rgba(255, 99, 132, 1)',
            },
            {
              label: 'Students Placed',
              data: chartData.map(item => item.studentsPlaced),
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderColor: 'rgba(75, 192, 192, 1)',
            }
          ]
        };
      case 'companies':
        return {
          labels,
          datasets: [{
            label: 'Companies Hiring',
            data: chartData.map(item => item.companiesHiring),
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
            borderColor: 'rgba(153, 102, 255, 1)',
          }]
        };
      case 'packages':
        return {
          labels,
          datasets: [
            {
              label: 'Highest Package',
              data: chartData.map(item => item.highestPackage),
              backgroundColor: 'rgba(255, 206, 86, 0.8)',
              borderColor: 'rgba(255, 206, 86, 1)',
            },
            {
              label: 'Average Package',
              data: chartData.map(item => item.averagePackage),
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: 'rgba(54, 162, 235, 1)',
            },
            {
              label: 'Lowest Package',
              data: chartData.map(item => item.lowestPackage),
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              borderColor: 'rgba(255, 99, 132, 1)',
            }
          ]
        };
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="pt-20 px-6 md:px-5 lg:px-16">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Placement Portal</h1>
        <button
          onClick={() => openModal()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Placement Data
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BarChart 
            data={prepareChartData('students')} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { 
                  display: true, 
                  text: 'Student Placement Numbers' 
                }
              }
            }} 
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BarChart 
            data={prepareChartData('companies')} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { 
                  display: true, 
                  text: 'Companies Hiring' 
                }
              }
            }} 
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BarChart 
            data={prepareChartData('packages')} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { 
                  display: true, 
                  text: 'Package Statistics' 
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Data Table Section */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Placement Data Table</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Year</th>
              <th className="border p-2">Students Applied</th>
              <th className="border p-2">Students Placed</th>
              <th className="border p-2">Companies Hiring</th>
              <th className="border p-2">Highest Package</th>
              <th className="border p-2">Average Package</th>
              <th className="border p-2">Lowest Package</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{item.year}</td>
                <td className="border p-2 text-center">{item.totalStudentsApplied}</td>
                <td className="border p-2 text-center">{item.studentsPlaced}</td>
                <td className="border p-2 text-center">{item.companiesHiring}</td>
                <td className="border p-2 text-center">{item.highestPackage}</td>
                <td className="border p-2 text-center">{item.averagePackage}</td>
                <td className="border p-2 text-center">{item.lowestPackage}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => openModal(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    {/* <button 
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal (existing implementation) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{editData ? 'Edit Data' : 'Add New Data'}</h2>
            <form onSubmit={handleSubmit}>
              {[
                'year', 
                'studentsApplied', 
                'studentsPlaced', 
                'companiesHiring',
                'highestPackage',
                'averagePackage',
                'lowestPackage'
              ].map((field, idx) => (
                <div key={idx} className="mb-4">
                  <label className="block text-sm font-medium mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {editData ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyChartPage;