import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SchoolProvider } from "./contexts/SchoolContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import { PrimaryPage, JuniorPage, SeniorPage } from "./pages/SchoolLevels";
import Assessments from "./pages/Assessments";
import Attendance from "./pages/Attendance";
import FeesCollection from "./pages/FeesCollection";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
      <Route path="/primary" element={<ProtectedRoute><PrimaryPage /></ProtectedRoute>} />
      <Route path="/junior" element={<ProtectedRoute><JuniorPage /></ProtectedRoute>} />
      <Route path="/senior" element={<ProtectedRoute><SeniorPage /></ProtectedRoute>} />
      <Route path="/senior/stem" element={<ProtectedRoute><SeniorPage /></ProtectedRoute>} />
      <Route path="/senior/social-sciences" element={<ProtectedRoute><SeniorPage /></ProtectedRoute>} />
      <Route path="/senior/arts-sports" element={<ProtectedRoute><SeniorPage /></ProtectedRoute>} />
      <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
      <Route path="/marklist" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
      <Route path="/timetable" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/fees" element={<ProtectedRoute><FeesCollection /></ProtectedRoute>} />
      <Route path="/fees-register" element={<ProtectedRoute><FeesCollection /></ProtectedRoute>} />
      <Route path="/fees-reminders" element={<ProtectedRoute><FeesCollection /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/transport" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SchoolProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </SchoolProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
