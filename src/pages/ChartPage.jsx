import React from 'react';
import BarChart from '../components/Charts/Barchart';

const StudentPlacementChart = () => {
  // Updated data for placement numbers by year (First Chart)
  const dataByYear = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Students Applied',
        data: [80, 100, 120, 140, 160], // Replace with actual data for students who applied
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        barThickness: 20, // Set bar thickness
        maxBarThickness: 20, // Set max bar thickness
      },
      {
        label: 'Students Placed',
        data: [50, 75, 100, 125, 150], // Replace with actual data for students who got placed
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        barThickness: 20, // Set bar thickness
        maxBarThickness: 20, // Set max bar thickness
      },
    ],
  };

  const optionsByYear = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Student Placement Numbers by Year',
        font: {
          size: 20,
        },
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
        ticks: {
          color: '#333',
        },
        stacked: false, // Ensure the bars are not stacked
        grid: {
          display: false, // Remove grid lines for better visual clarity
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Lighten the grid lines
        },
      },
    },
  };

  // Data for the number of companies hiring students each year (Second Chart)
  const dataByCompanyCount = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Number of Companies',
        data: [10, 12, 15, 18, 20], // Replace with your actual data
        backgroundColor: 'rgba(153, 102, 255, 0.8)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(153, 102, 255, 1)',
        hoverBorderColor: 'rgba(153, 102, 255, 1)',
        barThickness: 30, // Set bar thickness
        maxBarThickness: 30, // Set max bar thickness
      },
    ],
  };

  const optionsByCompanyCount = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Number of Companies Hiring by Year',
        font: {
          size: 20,
        },
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
        ticks: {
          color: '#333',
        },
        grid: {
          display: false, // Remove grid lines for better visual clarity
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Lighten the grid lines
        },
      },
    },
  };

  return (
    <div className="pt-20 px-6 md:px-5 lg:px-16">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Placement Portal</h1>
        <p className="text-lg text-gray-600 mt-4">
          Analyze student placement trends and company participation over the years.
        </p>
      </header>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BarChart data={dataByYear} options={optionsByYear} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BarChart data={dataByCompanyCount} options={optionsByCompanyCount} />
        </div>
      </div>
    </div>
  );
};

export default StudentPlacementChart;
