import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoute';
import SNavbar from './components/Student/SNavbar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import StudentSignUpPage from './pages/StudentSignUpPage';
import FacultySignUpPage from './pages/FacultySignUpPage';
import CompanySignUpPage from './pages/CompanySignUpPage';
import FNavbar from './components/Faculty/fNavbar';
import AddPlacementDrive from './pages/faculty/AddPlacementDrive';
import AddResource from './pages/faculty/AddResource';
import AddExam from './pages/faculty/AddExam';
import StudentCorner from './pages/faculty/StudentCorner';
import PlacementDrives from './pages/Student/PlacementDrives';
import ExamCenter from './pages/Student/ExamCenter';
import Resources from './pages/Student/Resources';
import Feedback from './pages/Student/Feedback';
import Support from './pages/Student/SupportPage';
import ChartPage from './pages/Student/ChartPage';
import ProfilePage from './components/Student/ProfilePage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';
import OTPVerificationPage from './components/otpVarification/OTPVerificationPage';
import FacultyChartPage from './pages/faculty/FacultyChartPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/signup/student" element={<StudentSignUpPage />} />
          <Route path="/signup/faculty" element={<FacultySignUpPage />} />
          <Route path="/signup/company" element={<CompanySignUpPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* New Route */}

          {/* Protected Student Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['student']}>
              <SNavbar />
            </ProtectedRoute>
          }>
            <Route index element={<ChartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="placementDrives" element={<PlacementDrives />} />
            <Route path="examCenter" element={<ExamCenter />} />
            <Route path="resources" element={<Resources />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Protected Faculty Routes */}
          <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FNavbar />
            </ProtectedRoute>
          }>
            <Route index element={<FacultyChartPage />} />
            <Route path="addplacementDrives" element={<AddPlacementDrive />} />
            <Route path="addexam" element={<AddExam />} />
            <Route path="addresources" element={<AddResource />} />
            <Route path="studentcorner" element={<StudentCorner />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;