import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SNavbar from './components/Student/SNavbar';
import Support from './pages/SupportPage';
import ExamCenter from './pages/ExamCenter';
import PlacementDrives from './pages/PlacementDrives';
import Feedback from './pages/Feedback';
import Resources from './pages/Resources';
import ChartPage from './pages/ChartPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import StudentSignUpPage from './pages/StudentSignUpPage';
import FacultySignUpPage from './pages/FacultySignUpPage';
import CompanySignUpPage from './pages/CompanySignUpPage';
import Homepage from './pages/Homepage';
import FNavbar from './components/Faculty/fNavbar';
import AddPlacementDrive from './pages/faculty/AddPlacementDrive';
import AddResource from './pages/faculty/AddResource';
import AddExam from './pages/faculty/AddExam';
import StudentCorner from './pages/faculty/StudentCorner';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/student" element={<StudentSignUpPage />} />
        <Route path="/signup/faculty" element={<FacultySignUpPage />} />
        <Route path="/signup/company" element={<CompanySignUpPage />} />

        {/* Routes wrapped with the SNavbar for Students */}
        <Route path="/" element={<SNavbar />}>
          <Route index element={<ChartPage />} />
          <Route path="placementDrives" element={<PlacementDrives />} />
          <Route path="examCenter" element={<ExamCenter />} />
          <Route path="resources" element={<Resources />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Routes wrapped with the FNavbar for Faculty */}
        <Route path="/faculty" element={<FNavbar />}>
          <Route index element={<ChartPage />} />
          <Route path="addplacementDrives" element={<AddPlacementDrive />} />
          <Route path="addexam" element={<AddExam />} />
          <Route path="addresources" element={<AddResource />} />
          <Route path="studentcorner" element={<StudentCorner />} />
        </Route>

        {/* Catch-all route (optional) */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
