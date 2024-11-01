import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SNavbar from './components/Student/SNavbar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import StudentSignUpPage from './pages/StudentSignUpPage';
import FacultySignUpPage from './pages/FacultySignUpPage';
import CompanySignUpPage from './pages/CompanySignUpPage';
// import Homepage from './pages/Homepage';
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
          <Route path="/profile" element={<ProfilePage />} />
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
