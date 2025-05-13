import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import NotFound from "./components/NotFound/NotFound";
import ClassManagement from "./components/ClassManagement/ClassManagement";
import AttendanceComponent from "./components/Attendance/AttendanceComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AttendanceComponent />} />
          <Route path="management" element={<ClassManagement />} />
          {/* Add more routes as you uncomment navigation items */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
