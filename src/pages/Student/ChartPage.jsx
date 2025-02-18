import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from '../../components/Charts/Barchart';

const ChartPage = () => {
  const [chartData, setChartData] = useState(null);
  const API_BASE_URL = 'http://localhost:3003/chart/chart-data';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_BASE_URL, { withCredentials: true });
        if (response.data.success) {
          setChartData(response.data.data);
        } else {
          console.error('Failed to fetch chart data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error.message);
      }
    };
    fetchData();
  }, []);

  const prepareStudentData = () => {
    if (!chartData) return null;

    return {
      labels: chartData.map(item => item.year),
      datasets: [
        {
          label: 'Students Applied',
          data: chartData.map(item => item.totalStudentsApplied),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          barThickness: 20,  // Increased bar thickness
          maxBarThickness: 40,
        },
        {
          label: 'Students Placed',
          data: chartData.map(item => item.studentsPlaced),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          barThickness: 20,  // Increased bar thickness
          maxBarThickness: 40,
        },
      ],
    };
  };

  const prepareCompanyData = () => {
    if (!chartData) return null;

    return {
      labels: chartData.map(item => item.year),
      datasets: [
        {
          label: 'Number of Companies',
          data: chartData.map(item => item.companiesHiring),
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          barThickness: 30,
          maxBarThickness: 50,
        },
      ],
    };
  };

  const preparePackageData = () => {
    if (!chartData) return null;

    return {
      labels: chartData.map(item => item.year),
      datasets: [
        {
          label: 'Highest Package',
          data: chartData.map(item => item.highestPackage),
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          barThickness: 15,  // Increased bar thickness
          maxBarThickness: 40,
        },
        {
          label: 'Average Package',
          data: chartData.map(item => item.averagePackage),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          barThickness: 15,  // Increased bar thickness
          maxBarThickness: 40,
        },
        {
          label: 'Lowest Package',
          data: chartData.map(item => item.lowestPackage),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          barThickness: 15,  // Increased bar thickness
          maxBarThickness: 40,
        }
      ],
    };
  };

  // Enhanced chart options with better scaling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Allow chart to determine its own height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 16 },
          color: '#333',
        },
      },
      title: {
        display: true,
        font: { size: 20 },
        color: '#333',
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        ticks: { color: '#333' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#333' },
        beginAtZero: true,
        grid: { color: 'rgba(200, 200, 200, 0.2)' },
        // Enhanced scale options for better visibility
        suggestedMax: function(context) {
          const data = context.chart.data.datasets[0].data;
          const max = Math.max(...data);
          return max * 1.2; // Add 20% padding to the top
        },
      },
    },
  };

  return (
    <div className="pt-20 px-6 md:px-5 lg:px-16">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Placement Portal</h1>
        <p className="text-lg text-gray-600 mt-4">
          Analyze student placement trends and company participation over the years.
        </p>
      </header>

      {chartData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 h-96">  {/* Fixed height container */}
            <BarChart 
              data={prepareStudentData()} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { 
                    display: true, 
                    text: 'Student Placement Numbers by Year' 
                  }
                }
              }} 
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 h-96">  {/* Fixed height container */}
            <BarChart 
              data={prepareCompanyData()} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { 
                    display: true, 
                    text: 'Number of Companies Hiring by Year' 
                  }
                }
              }} 
            />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 h-96">  {/* Fixed height container */}
            <BarChart 
              data={preparePackageData()} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: { 
                    display: true, 
                    text: 'Package Statistics by Year' 
                  }
                }
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPage;