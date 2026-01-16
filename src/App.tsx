import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SchoolProvider } from "./contexts/SchoolContext";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import { PrimaryPage, JuniorPage, SeniorPage } from "./pages/SchoolLevels";
import Assessments from "./pages/Assessments";
import Attendance from "./pages/Attendance";
import FeesCollection from "./pages/FeesCollection";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SchoolProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/primary" element={<PrimaryPage />} />
            <Route path="/junior" element={<JuniorPage />} />
            <Route path="/senior" element={<SeniorPage />} />
            <Route path="/senior/stem" element={<SeniorPage />} />
            <Route path="/senior/social-sciences" element={<SeniorPage />} />
            <Route path="/senior/arts-sports" element={<SeniorPage />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/marklist" element={<Assessments />} />
            <Route path="/results" element={<Assessments />} />
            <Route path="/timetable" element={<Attendance />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/fees" element={<FeesCollection />} />
            <Route path="/fees-register" element={<FeesCollection />} />
            <Route path="/fees-reminders" element={<FeesCollection />} />
            <Route path="/payroll" element={<Teachers />} />
            <Route path="/library" element={<Dashboard />} />
            <Route path="/transport" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SchoolProvider>
  </QueryClientProvider>
);

export default App;
