import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from './pages/Profile.jsx';
import ReportIncidentForm from "./components/ReportIncidentForm.jsx";
import IncidentsByState from "./pages/IncidentsByState";
import Notifications from "./pages/Notifications.jsx";
import IncidentDetails from "./pages/IncidentDetails.jsx";
import MyIncidents from "./pages/MyIncidents.jsx";
import Footer from "./components/Footer.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"; 
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminIncidents from "./pages/admin/AdminIncidents"; 
import AdminReportIncident from "./pages/admin/AdminReportIncident.jsx";
import ChatPage from "./pages/ChatPage";
import ChatInbox from "./pages/ChatInbox.jsx";
import { ToastContainer } from "react-toastify";
import GlobalMessageListener from "./components/GlobalMessageListener";
function App() {
  return (
    <>
      <Navbar />
      <GlobalMessageListener /> 
      <Routes>
        <Route path="/" element={< Home/>}/>
        <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/report" element={<ReportIncidentForm/>} />
          <Route path="/incident/:id" element={<IncidentDetails />} />
          <Route path="/my-incidents" element={<MyIncidents/>}/>
           <Route path="/admin/dashboard" element={<AdminDashboard />} />
           <Route path="/admin/users" element={<AdminUsers/>}/>
           <Route path="/admin/incidents" element={<AdminIncidents />} />
          <Route path="/chat/:incidentId/:receiverId" element={<ChatPage />} />

           <Route path="/admin/report-incident" element={<AdminReportIncident />} />
           <Route path="/incidents" element={<IncidentsByState />} />
          <Route path="/chat-inbox" element={<ChatInbox />} />
        <Route path="/profile" element={< Profile/>}/>
      </Routes>
       <ToastContainer />
      
    </>
  );
}

export default App;
