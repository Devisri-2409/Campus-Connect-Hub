import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import DashboardLayout from "./layouts/DashboardLayout";
import Sessions from "./pages/Sessions";
import Assistant from "./components/Assistant";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyGroups from "./pages/MyGroups";


function App() {
  return (
  <ThemeProvider>
  <BrowserRouter>
  <Routes>
    
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/groups"
      element={
           <ProtectedRoute>
        <DashboardLayout>
          <Groups />
        </DashboardLayout>
           </ProtectedRoute>
      }
    />

    <Route
    path="/mygroups"
    element={
        <ProtectedRoute>
            <DashboardLayout>
                <MyGroups />
            </DashboardLayout>
        </ProtectedRoute>
    }
/>
    <Route
      path="/notes"
      element={
           <ProtectedRoute>
        <DashboardLayout>
          <Notes />
        </DashboardLayout>
           </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
           <ProtectedRoute>
        <DashboardLayout>
          <Profile />
        </DashboardLayout>
           </ProtectedRoute>
      }
    />
    <Route
    path="/sessions"
    element={
         <ProtectedRoute>
        <DashboardLayout>
            <Sessions />
        </DashboardLayout>
      </ProtectedRoute>
    }
/>

    <Route
      path="/assistant"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <Assistant />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />

  </Routes>
</BrowserRouter>
  </ThemeProvider>
  );
}

export default App;