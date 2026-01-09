import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Activity,
  Target,
  BookOpen,
  FileText,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { NotificationBell } from "../../components/notifications/NotificationBell";

// Import page components
import { CycleTrackingPage } from "./CycleTrackingPage";
import { SymptomLogPage } from "./SymptomLogPage";
import { RiskReportPage } from "./RiskReportPage";
import { HabitsPage } from "./HabitsPage";
import { AppointmentPrepPage } from "./AppointmentPrepPage";
import DailyLogPage from "./DailyLogPage";
import ComprehensiveHealthPage from "./ComprehensiveHealthPage";
import { NextCyclePrediction } from "../../components/prediction/NextCyclePrediction";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Shared components
import { LandingPage } from "../LandingPage";
import { SurveyInsightsCard } from "../../components/survey/SurveyInsightsCard";

const Overview = () => {
  const { data: riskData } = useQuery({
    queryKey: ["risk", "latest"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/risk/latest`);
        return response.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-600">
          Track your wellness journey and stay informed
        </p>
      </div>

      {/* Medical Disclaimer */}
      <div className="medical-disclaimer">
        <p className="text-sm font-medium">
          ⚕️ This app does not diagnose. It supports early awareness and doctor
          consultation.
        </p>
      </div>

      {/* Priority Section - Top Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Comprehensive Health Tracker Highlight */}
        <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">
                🏥 Comprehensive Health Tracker
              </h3>
              <p className="text-purple-100 text-sm">
                Track meds, nutrition, mood, sleep, and more in one place.
              </p>
            </div>
          </div>
          <Link
            to="/user/health"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-bold shadow-md"
          >
            Go to Tracker →
          </Link>
        </div>

        {/* Next Cycle Prediction */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <NextCyclePrediction />
        </div>
      </div>

      {/* Survey Insights */}
      <SurveyInsightsCard />

      {/* Quick Actions - Second Row */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/user/daily-log"
            className="card hover:shadow-lg transition-shadow group"
          >
            <ClipboardList className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-800 mb-2">Daily Log</h4>
            <p className="text-sm text-gray-600 mb-3">
              Track your daily health and mood
            </p>
            <span className="text-purple-600 text-sm font-medium">
              Log Today →
            </span>
          </Link>

          <Link
            to="/user/cycle"
            className="card hover:shadow-lg transition-shadow group"
          >
            <Calendar className="w-8 h-8 text-soft-pink-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-800 mb-2">Cycle Tracking</h4>
            <p className="text-sm text-gray-600 mb-3">
              Log your menstrual cycles
            </p>
            <span className="text-soft-pink-600 text-sm font-medium">
              Track Now →
            </span>
          </Link>

          <Link
            to="/user/appointment"
            className="card hover:shadow-lg transition-shadow group"
          >
            <FileText className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-800 mb-2">Appointment Prep</h4>
            <p className="text-sm text-gray-600 mb-3">
              Generate your health summary
            </p>
            <span className="text-blue-600 text-sm font-medium">
              Prepare Pack →
            </span>
          </Link>
        </div>
      </div>

      {/* Health Tracking Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Tracking</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Link to="/user/symptoms" className="card hover:shadow-lg transition-shadow text-center">
            <Activity className="w-8 h-8 text-sage-600 mb-2 mx-auto" />
            <h4 className="font-semibold text-gray-800 text-sm">Symptoms</h4>
          </Link>

          <Link to="/user/risk" className="card hover:shadow-lg transition-shadow text-center">
            <Target className="w-8 h-8 text-warm-beige-700 mb-2 mx-auto" />
            <h4 className="font-semibold text-gray-800 text-sm">Risk Report</h4>
            {riskData?.risk && (
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${riskData.risk.riskLevel === "LOW"
                    ? "bg-green-100 text-green-700"
                    : riskData.risk.riskLevel === "MODERATE"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {riskData.risk.riskLevel}
              </div>
            )}
          </Link>

          <Link to="/user/habits" className="card hover:shadow-lg transition-shadow text-center">
            <BookOpen className="w-8 h-8 text-indigo-600 mb-2 mx-auto" />
            <h4 className="font-semibold text-gray-800 text-sm">Habits</h4>
          </Link>

          <Link to="/user/health" className="card hover:shadow-lg transition-shadow text-center">
            <Activity className="w-8 h-8 text-teal-600 mb-2 mx-auto" />
            <h4 className="font-semibold text-gray-800 text-sm">Full Tracker</h4>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CycleTracking = () => <CycleTrackingPage />;
const Symptoms = () => <SymptomLogPage />;
const RiskReport = () => <RiskReportPage />;
const Habits = () => <HabitsPage />;

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/user", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { path: "/user/daily-log", icon: ClipboardList, label: "Daily Log" },
    { path: "/user/health", icon: Activity, label: "Health Tracker" },
    { path: "/user/cycle", icon: Calendar, label: "Cycle Tracking" },
    { path: "/user/symptoms", icon: Activity, label: "Symptoms" },
    { path: "/user/risk", icon: Target, label: "Risk Report" },
    { path: "/user/habits", icon: BookOpen, label: "Habits" },
    { path: "/user/appointment", icon: FileText, label: "Appointment Prep" },
  ];

  return (
    <div className="min-h-screen bg-warm-beige-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gradient-to-br from-white to-soft-pink-50/30 border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-soft-pink-400 to-vibrant-purple-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {user?.firstName || "User"}
              </p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-vibrant-purple-50 hover:text-soft-pink-600 transition-all duration-300 mb-1 hover-lift"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-soft-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.firstName?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <nav className="p-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-soft-pink-50 hover:text-soft-pink-600 transition-colors mb-1"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                PCOS Wellness
              </h1>
            </div>
            <NotificationBell />
          </div>
        </header>

        <div className="p-4 md:p-8">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="daily-log" element={<DailyLogPage />} />{" "}
            <Route path="health" element={<ComprehensiveHealthPage />} />{" "}
            <Route path="cycle" element={<CycleTrackingPage />} />
            <Route path="symptoms" element={<SymptomLogPage />} />
            <Route path="risk" element={<RiskReportPage />} />
            <Route path="habits" element={<Habits />} />
            <Route path="appointment" element={<AppointmentPrepPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
